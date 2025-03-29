import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllInterviews = query({
	handler: async(ctx)=> {
		const identity = ctx.auth.getUserIdentity();
		if(!identity) throw new Error("user not authenticated");

		return await ctx.db.query("interviews").collect();
	}
})


export const getMyInterview = query({
	handler: async(ctx)=> {
		const identity = await ctx.auth.getUserIdentity();
		if(!identity) return [];

		const interviews = await ctx.db.query("interviews")
		.withIndex("by_candidate_id", q=> q.eq("candidateId", identity.subject))
		.collect();
		return interviews;
	}
})

export const getInterviewByStreamCallId = query({
	args: {
		streamCallId: v.string()
	},
	handler: async (ctx, args)=> {
		const interviews =  await ctx.db.query("interviews")
		.withIndex("by_stream_call_id", q=> q.eq("streamCallId", args.streamCallId))
		.collect();
		return interviews;
	}
})

export const createInterview = mutation({
	args: {
		title: v.string(),
    description: v.optional(v.string()),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string())
	},
	handler: async(ctx, args)=> {
		const identity = await ctx.auth.getUserIdentity();
		if(!identity) throw new Error("user not authenticated");

		await ctx.db.insert("interviews", {
			...args
		})
	}
});


export const updateIterviewStatus = mutation({
	args: {
		id: v.id("interviews"),
		status: v.string()
	},
	handler: async(ctx, args)=> {
		return await ctx.db.patch(args.id, {
			status: args.status,
			...(args.status === "completed" ? { endTime: Date.now().toString() } : {})
		})
	}
})