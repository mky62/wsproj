import { pgEnum, pgTable, uuid, varchar, timestamp, integer, jsonb, text, index } from "drizzle-orm/pg-core";

export const matchStatusEnum = pgEnum("match_status", [
    "scheduled",
    "live",
    "finished",
]);

export const matches = pgTable("matches", {
    id: uuid("id").defaultRandom().primaryKey(),
    sport: varchar("sport", { length: 50 }).notNull(),
    homeTeam: varchar("home_team", { length: 100 }).notNull(),
    awayTeam: varchar("away_team", { length: 100 }).notNull(),
    status: matchStatusEnum("status").default("scheduled").notNull(),
    startTime: timestamp("start_time", { withTimezone: true }),
    endTime: timestamp("end_time", { withTimezone: true }),
    homeScore: integer("home_score").default(0).notNull(),
    awayScore: integer("away_score").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const commentary = pgTable("commentary", {
    id: uuid("id").defaultRandom().primaryKey(),
    matchId: uuid("match_id")
        .references(() => matches.id, { onDelete: "cascade" })
        .notNull(),
    minute: integer("minute").notNull(),
    sequence: integer("sequence").notNull(),
    period: varchar("period", { length: 20 }).notNull(),
    eventType: varchar("event_type", { length: 50 }).notNull(),
    actor: varchar("actor", { length: 100 }),
    team: varchar("team", { length: 100 }),
    message: text("message").notNull(),
    metadata: jsonb("metadata"),
    tags: varchar("tags", { length: 255 }).array(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
    index("commentary_match_id_idx").on(table.matchId),
    index("commentary_minute_idx").on(table.minute),
]);
