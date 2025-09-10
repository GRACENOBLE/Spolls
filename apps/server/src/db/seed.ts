// backend/db/seed.ts
import "dotenv/config"; // Ensure environment variables are loaded for DATABASE_URL
import { db } from "./index.js"; // Import your Drizzle DB client
import { polls } from "./schema.js"; // Import your polls schema
import type { NewPoll } from "../index.js"; // Import NewPoll type from your main API file

async function seed() {
  console.log("Starting database seeding...");

  const dummyPolls: NewPoll[] = [
    {
      question:
        "Would you rather fight one horse-sized duck or one hundred duck-sized horses?",
      slug: "horse-sized-duck-vs-duck-sized-horses",
      optionA_text: "One horse-sized duck",
      optionB_text: "One hundred duck-sized horses",
    },
    {
      question:
        "Would you rather have the ability to talk to animals or speak all human languages?",
      slug: "talk-to-animals-vs-speak-all-languages",
      optionA_text: "Talk to animals",
      optionB_text: "Speak all human languages",
    },
    {
      question:
        "Would you rather always be 10 minutes late or always be 20 minutes early?",
      slug: "10-minutes-late-vs-20-minutes-early",
      optionA_text: "Always 10 minutes late",
      optionB_text: "Always 20 minutes early",
    },
    {
      question:
        "Would you rather live without the internet or live without air conditioning?",
      slug: "without-internet-vs-without-air-conditioning",
      optionA_text: "Without Internet",
      optionB_text: "Without Air Conditioning",
    },
    {
      question:
        "Would you rather only be able to whisper or only be able to shout?",
      slug: "only-whisper-vs-only-shout",
      optionA_text: "Only whisper",
      optionB_text: "Only shout",
    },
  ];

  try {
    // Clear existing polls (optional, for fresh seeding)
    console.log("Deleting existing poll data...");
    await db.delete(polls); // Be careful with this in production!
    console.log("Existing poll data deleted.");

    // Insert dummy polls
    console.log("Inserting new dummy polls...");
    for (const poll of dummyPolls) {
      await db.insert(polls).values(poll);
    }
    console.log("Dummy polls inserted successfully!");

    console.log("Database seeding complete.");
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1); // Exit with an error code
  } finally {
    // It's a good practice to disconnect the database pool after seeding.
    // If your `db` client is set up with a global pool that doesn't auto-close,
    // you might need to add a pool.end() call here.
    // For `@neondatabase/serverless` with `Pool`, it often manages connections implicitly.
  }
}

// Execute the seeding function
seed();
