// backend/src/index.ts
import "dotenv/config"; // To load environment variables from .env file
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server"; // For serving Hono on Node.js

// Import your Drizzle schema
import { polls, anonymousVotes } from "./db/schema";
// Import your pre-initialized Drizzle DB client
import { db } from "./db"; // Assuming this file exports your Drizzle client

import {
  and,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";

// Define types for polls and vote records based on your Drizzle schema
export type Poll = InferSelectModel<typeof polls>;
export type NewPoll = InferInsertModel<typeof polls>;
export type AnonymousVote = InferSelectModel<typeof anonymousVotes>; // Not strictly needed here, but good for clarity if you fetch anonymous votes
export type NewAnonymousVote = InferInsertModel<typeof anonymousVotes>;

// --- START: Real-time SSE Event Bus (simplified for weekend project) ---
// This simple in-memory EventBus will manage connected SSE clients
// and broadcast updates. In a multi-instance/distributed environment,
// you would replace this with a dedicated pub/sub service (e.g., Redis Pub/Sub, NATS, or a Cloudflare Durable Object).
interface PollUpdateEvent {
  pollId: string;
  updatedPoll: Poll;
}

// A Map to store active SSE connections, keyed by pollId
const activePollStreams = new Map<
  number,
  Set<ReadableStreamDefaultController<Uint8Array>>
>();

// Function to add a new SSE client for a specific poll
const addPollStreamClient = (
  pollId: number,
  controller: ReadableStreamDefaultController<Uint8Array>
) => {
  if (!activePollStreams.has(pollId)) {
    activePollStreams.set(pollId, new Set());
  }
  activePollStreams.get(pollId)?.add(controller);
  console.log(
    `SSE: Client subscribed to poll ${pollId}. Total subscribers for poll ${pollId}: ${
      activePollStreams.get(pollId)?.size
    }`
  );
};

// Function to remove an SSE client
const removePollStreamClient = (
  pollId: number,
  controller: ReadableStreamDefaultController<Uint8Array>
) => {
  const clients = activePollStreams.get(pollId);
  if (clients) {
    clients.delete(controller);
    if (clients.size === 0) {
      activePollStreams.delete(pollId); // Clean up if no more clients for this poll
    }
  }
  console.log(
    `SSE: Client unsubscribed from poll ${pollId}. Remaining subscribers for poll ${pollId}: ${
      activePollStreams.get(pollId)?.size || 0
    }`
  );
};

// Function to broadcast a poll update to all subscribed clients
const broadcastPollUpdate = (event: PollUpdateEvent) => {
  const clients = activePollStreams.get(event.pollId);
  if (clients) {
    const data = `data: ${JSON.stringify(event.updatedPoll)}\n\n`; // SSE format
    const encoded = new TextEncoder().encode(data);
    clients.forEach((controller) => {
      try {
        controller.enqueue(encoded);
      } catch (e) {
        console.error(
          "SSE: Failed to enqueue data to client, removing controller:",
          e
        );
        // Remove the problematic controller to prevent further errors
        removePollStreamClient(event.pollId, controller);
      }
    });
    console.log(
      `SSE: Broadcasted update for poll ${event.pollId} to ${clients.size} clients.`
    );
  }
};
// --- END: Real-time SSE Event Bus ---

// Create a Hono app instance
const app = new Hono();

// Global middlewares
app.use(logger()); // Logs incoming requests
app.use(
  "/*", // Apply CORS to all routes
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : [], // Allow multiple origins if comma-separated
    allowMethods: ["GET", "POST", "OPTIONS"], // Explicitly allow methods
    credentials: true, // Allow cookies, authorization headers etc.
  })
);

// Simple root route to check if API is alive
app.get("/", (c) => {
  return c.json({ status: "PSP (The Public Shadow Poll) Backend: OK" });
});

/**
 * Endpoint to get all active polls.
 * GET /polls
 */
app.get("/polls", async (c) => {
  try {
    // Fetch all polls, and for each poll, eager load its associated topics
    // using the relations defined in your schema.
    const allPollsWithTopics = await db.query.polls.findMany({
      with: {
        pollTopics: {
          // This refers to the 'pollTopics' relation defined in pollsRelations
          with: {
            topic: true, // Eagerly load the 'topic' details from the 'topics' table
          },
        },
      },
    });

    // Transform the data for a cleaner API response
    // to group topics directly under each poll, returning only name and slug for each topic.
    const formattedPolls = allPollsWithTopics.map((poll) => ({
      ...poll,
      // Map the array of pollTopics (join table entries) to just an array of topic objects,
      // selecting only the 'name' and 'slug' from each topic.
      topics: poll.pollTopics.map((pt) => ({
        name: pt.topic.name,
        slug: pt.topic.slug,
      })),
      pollTopics: undefined, // Optionally remove the raw join table data if not needed in the final API response
    }));

    return c.json(formattedPolls);
  } catch (error) {
    console.error("Error fetching polls with categories:", error);
    return c.json({ error: "Failed to retrieve polls with categories" }, 500);
  }
});

/**
 * Endpoint to get details for a single poll.
 * GET /polls/:id
 */
app.get("/polls/:slug", async (c) => {
  try {
    const pollSlug = c.req.param("slug"); // Convert ID from string to number

    const poll = await db
      .select()
      .from(polls)
      .where(eq(polls.slug, pollSlug))
      .limit(1);

    if (poll.length === 0) {
      return c.json({ error: "Poll not found" }, 404);
    }

    return c.json(poll[0]); // Return the single poll object
  } catch (error) {
    console.error("Error fetching poll", c.req.param("id"), error);
    return c.json({ error: "Failed to retrieve poll" }, 500);
  }
});

/**
 * Endpoint to create a new poll.
 * POST /polls
 * Request Body: { "question": "string", "optionA_text": "string", "optionB_text": "string" }
 */
app.post("/polls", async (c) => {
  try {
    const body = await c.req.json();

    // Basic validation for required fields
    if (!body.question || !body.optionA_text || !body.optionB_text) {
      return c.json(
        {
          error:
            "Missing required poll fields (question, optionA_text, optionB_text)",
        },
        400
      );
    }

    const newPollData: NewPoll = {
      question: body.question,
      optionA_text: body.optionA_text,
      optionB_text: body.optionB_text,
      slug: body.slug
    };

    const insertedPoll = await db.insert(polls).values(newPollData).returning();

    if (insertedPoll.length === 0) {
      return c.json({ error: "Failed to create poll" }, 500);
    }

    return c.json(insertedPoll[0], 201); // Return the newly created poll
  } catch (error) {
    console.error("Error creating poll:", error);
    return c.json({ error: "Failed to create poll" }, 500);
  }
});

/**
 * Endpoint to cast a vote for a poll.
 * POST /polls/:id/vote
 * Request Body: { "option": "A" | "B", "voterIdentifier": "string" (UUID generated by client) }
 */
app.post("/polls/:id/vote", async (c) => {
  // Corrected path to include leading slash
  try {
    const pollId = c.req.param("id");
    const body = await c.req.json();
    const option = body.option; // Expected to be 'A' or 'B'
    // Get the voterIdentifier from the request body.
    // This UUID should be generated and persistently stored by the client (e.g., in localStorage).
    const voterIdentifier: string = body.voterIdentifier;

    if (option !== "A" && option !== "B") {
      return c.json({ error: 'Invalid vote option. Must be "A" or "B".' }, 400);
    }
    if (!voterIdentifier || typeof voterIdentifier !== "string") {
      return c.json(
        { error: "Missing or invalid voterIdentifier. A UUID is required." },
        400
      );
    }

    // Basic Anonymous Vote Limiting: Check if this anonymous user (identified by voterIdentifier) has already voted on this poll.
    const existingVote = await db
      .select()
      .from(anonymousVotes)
      .where(
        and(
          eq(anonymousVotes.pollId, pollId),
          eq(anonymousVotes.voterIdentifier, voterIdentifier)
        )
      )
      .limit(1);

    if (existingVote.length > 0) {
      return c.json({ error: "You have already voted on this poll." }, 403); // Forbidden
    }

    // --- START: Sequential Operations for Vote & Record (no transaction) ---
    let updatedPoll: Poll | null = null;
    try {
      // 1. Record the anonymous vote FIRST to prevent re-voting.
      const newAnonymousVote: NewAnonymousVote = {
        pollId: pollId,
        voterIdentifier: voterIdentifier,
        chosenOption: body.chosen_option
      };
      await db.insert(anonymousVotes).values(newAnonymousVote);

      // 2. Find the poll to ensure it exists and get current vote counts.
      const [currentPoll] = await db
        .select()
        .from(polls)
        .where(eq(polls.id, pollId));

      if (!currentPoll) {
        console.error(
          `Poll with ID ${pollId} not found after anonymous vote recorded. Data inconsistency.`
        );
        return c.json(
          { error: "Poll not found during vote update, inconsistent state." },
          500
        );
      }

      // 3. Prepare data for updating poll vote counts.
      let updatedPollData: Partial<Poll>;
      if (option === "A") {
        updatedPollData = { optionA_votes: currentPoll.optionA_votes + 1 };
      } else {
        updatedPollData = { optionB_votes: currentPoll.optionB_votes + 1 };
      }

      // 4. Update the poll's vote count and return the updated record.
      const [result] = await db
        .update(polls)
        .set(updatedPollData)
        .where(eq(polls.id, pollId))
        .returning();

      updatedPoll = result || null;
    } catch (innerError) {
      console.error("Error during sequential vote operations:", innerError);
      return c.json(
        { error: "Failed to process vote due to a database issue." },
        500
      );
    }
    // --- END: Sequential Operations ---

    if (!updatedPoll) {
      return c.json(
        { error: "Poll not found or vote failed due to an unknown issue." },
        404
      );
    }

    // --- START: Broadcast Poll Update (New Feature for SSE) ---
    // If the poll was successfully updated, broadcast the new state to all subscribed clients.
    broadcastPollUpdate({ pollId: pollId, updatedPoll: updatedPoll });
    // --- END: Broadcast Poll Update ---

    // Return the updated poll data.
    return c.json(updatedPoll);
  } catch (error) {
    console.error("Error casting vote:", error);
    return c.json({ error: "Failed to cast vote" }, 500);
  }
});

/**
 * SSE Endpoint to stream real-time poll updates.
 * GET /polls/:id/stream
 */
app.get("/polls/:id/stream", async (c) => {
  // Corrected path from /api/polls to /polls
  const pollId = Number(c.req.param("id"));

  if (isNaN(pollId)) {
    return c.json({ error: "Invalid poll ID for stream" }, 400);
  }

  // Set necessary headers for Server-Sent Events
  c.header("Content-Type", "text/event-stream");
  c.header("Cache-Control", "no-cache"); // Important for SSE to prevent caching
  c.header("Connection", "keep-alive"); // Important for SSE to keep connection open

  // Create a ReadableStream to push data to the client
  const stream = new ReadableStream({
    start(controller) {
      console.log(`SSE: Client connected to stream for poll ${pollId}`);
      // Add this client's controller to our active streams
      addPollStreamClient(pollId, controller);

      // Optionally, send the current poll state immediately on connection
      // This ensures clients get the latest data upon connecting.
      db.select()
        .from(polls)
        .where(eq(polls.id, pollId))
        .limit(1)
        .then(([currentPoll]) => {
          if (currentPoll) {
            const initialData = `data: ${JSON.stringify(currentPoll)}\n\n`;
            controller.enqueue(new TextEncoder().encode(initialData));
            console.log(`SSE: Sent initial data for poll ${pollId}`);
          }
        })
        .catch((err) =>
          console.error(
            `SSE: Error sending initial data for poll ${pollId}:`,
            err
          )
        );
    },
    cancel() {
      // This is called when the client disconnects (e.g., closes tab, navigates away)
      console.log(`SSE: Client disconnected from stream for poll ${pollId}`);
      removePollStreamClient(
        pollId,
        this as ReadableStreamDefaultController<Uint8Array>
      );
    },
  });

  // Return the stream as the response body
  return c.body(stream);
});

// Start the Hono server using the Node.js adapter
serve(
  {
    fetch: app.fetch,
    port: 3000, // Or whatever port you prefer
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
