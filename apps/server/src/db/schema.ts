// backend/db/schema.ts
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Schema for the 'polls' table.
 * Stores the details of each 'Would You Rather?' poll.
 */
export const polls = pgTable("polls", {
  // Primary key, auto-incrementing serial for unique poll identification.
  id: serial("id").primaryKey(),
  // The main question of the poll.
  question: text("question").notNull(),
  // Text for the first option.
  optionA_text: text("option_a_text").notNull(),
  // Text for the second option.
  optionB_text: text("option_b_text").notNull(),
  // Current vote count for option A. Defaults to 0.
  optionA_votes: integer("option_a_votes").notNull().default(0),
  // Current vote count for option B. Defaults to 0.
  optionB_votes: integer("option_b_votes").notNull().default(0),
  // Timestamp when the poll was created. Defaults to the current timestamp.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // Timestamp when the poll was last updated. Can be null initially.
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

/**
 * Relations for the 'polls' table.
 * A poll can have many anonymous votes associated with it.
 */
export const pollsRelations = relations(polls, ({ many }) => ({
  anonymousVotes: many(anonymousVotes),
}));

/**
 * Schema for the 'anonymous_votes' table.
 * Used for basic vote limiting to prevent multiple votes from the same anonymous user
 * on a single poll. The 'voter_identifier' could be an IP address or a session ID.
 */
export const anonymousVotes = pgTable(
    "anonymous_votes",
    {
        // Primary key for the vote record.
        id: serial("id").primaryKey(),
        // Foreign key referencing the 'id' of the 'polls' table.
        // This links a vote record to a specific poll.
        pollId: integer("poll_id")
            .notNull()
            .references(() => polls.id),
        // An identifier for the anonymous voter (e.g., IP address, simple session token).
        // This helps in preventing multiple votes from the same source.
        voterIdentifier: text("voter_identifier").notNull(),
        // Timestamp when the vote was cast.
        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => [
        // Ensures that a unique combination of pollId and voterIdentifier exists.
        // This prevents the same anonymous user from voting more than once on the same poll.
        uniqueIndex("poll_id_voter_identifier_idx").on(table.pollId, table.voterIdentifier),
    ]
);

/**
 * Relations for the 'anonymous_votes' table.
 * An anonymous vote belongs to one poll.
 */
export const anonymousVotesRelations = relations(anonymousVotes, ({ one }) => ({
  poll: one(polls, {
    fields: [anonymousVotes.pollId],
    references: [polls.id],
  }),
}));
