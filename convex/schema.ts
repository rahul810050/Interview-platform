import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.string(),
    role: v.union(v.literal('candidate'), v.literal('interviewer')), // candidate or interviewer
  }).index('by_clerk_id', ['clerkId']),
});


// https://rare-oriole-2.clerk.accounts.dev