CREATE TABLE "anonymous_votes" (
	"id" serial PRIMARY KEY NOT NULL,
	"poll_id" uuid NOT NULL,
	"voter_identifier" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poll_id" uuid NOT NULL,
	"comment_text" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"voter_identifier" text
);
--> statement-breakpoint
CREATE TABLE "polls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"slug" text NOT NULL,
	"option_a_text" text NOT NULL,
	"option_b_text" text NOT NULL,
	"option_c_text" text,
	"option_d_text" text,
	"option_a_votes" integer DEFAULT 0 NOT NULL,
	"option_b_votes" integer DEFAULT 0 NOT NULL,
	"option_c_votes" integer DEFAULT 0 NOT NULL,
	"option_d_votes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "polls_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "anonymous_votes" ADD CONSTRAINT "anonymous_votes_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_poll_id_polls_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."polls"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "poll_id_voter_identifier_idx" ON "anonymous_votes" USING btree ("poll_id","voter_identifier");