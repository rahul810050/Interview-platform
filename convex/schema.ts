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

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string())
  }).index("by_candidate_id", ["candidateId"]).index("by_stream_call_id", ["streamCallId"]),

  comments: defineTable({
    content: v.string(),
    rating: v.string(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

  
});


// https://rare-oriole-2.clerk.accounts.dev