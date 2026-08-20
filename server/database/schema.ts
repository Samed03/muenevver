import { boolean, datetime, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})

// Singleton-Tabelle: es gibt immer genau eine Zeile mit id = 1.
export const profile = mysqlTable('profile', {
  id: int('id').primaryKey(),
  heroTitle: varchar('hero_title', { length: 255 }).notNull(),
  heroSubtitle: varchar('hero_subtitle', { length: 255 }).notNull(),
  aboutText: text('about_text').notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
})

export const hobbies = mysqlTable('hobbies', {
  id: int('id').autoincrement().primaryKey(),
  icon: varchar('icon', { length: 16 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  sortOrder: int('sort_order').notNull().default(0)
})

export const travelDestinations = mysqlTable('travel_destinations', {
  id: int('id').autoincrement().primaryKey(),
  flagEmoji: varchar('flag_emoji', { length: 16 }).notNull().default(''),
  label: varchar('label', { length: 255 }).notNull(),
  photoPath: varchar('photo_path', { length: 255 }),
  isDream: boolean('is_dream').notNull().default(false),
  sortOrder: int('sort_order').notNull().default(0)
})

export const diaryStatus = ['draft', 'sealed', 'revealed'] as const

export const diaryEntries = mysqlTable('diary_entries', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  status: mysqlEnum('status', diaryStatus).notNull().default('draft'),
  revealAt: datetime('reveal_at'),
  notifyEmail: varchar('notify_email', { length: 255 }),
  sentAt: timestamp('sent_at'),
  createdBy: int('created_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow()
})

export const diaryImages = mysqlTable('diary_images', {
  id: int('id').autoincrement().primaryKey(),
  diaryEntryId: int('diary_entry_id').notNull(),
  path: varchar('path', { length: 255 }).notNull(),
  sortOrder: int('sort_order').notNull().default(0)
})
