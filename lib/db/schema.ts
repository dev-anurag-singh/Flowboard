import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import type { AdapterAccountType } from "next-auth/adapters"

// ─── Auth ────────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
})

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
)

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [uniqueIndex("verification_tokens_email_token_idx").on(vt.email, vt.token)]
)

// ─── App ─────────────────────────────────────────────────────────────────────

export const boards = pgTable("boards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
})

export const columns = pgTable("columns", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
})

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  columnId: uuid("column_id")
    .references(() => columns.id, { onDelete: "cascade" }),
  boardId: uuid("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id").references((): AnyPgColumn => tasks.id, {
    onDelete: "cascade",
  }),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
})

// ─── Relations ───────────────────────────────────────────────────────────────

export const boardsRelations = relations(boards, ({ many }) => ({
  columns: many(columns),
  tasks: many(tasks),
}))

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
  tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  board: one(boards, { fields: [tasks.boardId], references: [boards.id] }),
  column: one(columns, { fields: [tasks.columnId], references: [columns.id] }),
  parent: one(tasks, { fields: [tasks.parentId], references: [tasks.id], relationName: "subtasks" }),
  subtasks: many(tasks, { relationName: "subtasks" }),
}))
