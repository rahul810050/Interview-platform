import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const addComments = mutation({
	args: {
		content: v.string(),
		interviewId: v.id("interviews"),
		rating: v.string()
	},
	handler: async(ctx, args)=> {
		const identity = await ctx.auth.getUserIdentity();
		if(!identity) throw new Error("user not authenticated");

		return await ctx.db.insert("comments", {
			content: args.content,
			interviewId: args.interviewId,
			rating: args.rating,
			interviewerId: identity.subject
		})
	}
})


// get all the comments for a specific interview

export const getAllComments = query({
	args: { interviewId: v.id("interviews") },
	handler: async(ctx, args)=> {
		const comments = await ctx.db.query("comments")
		.withIndex("by_interview_id", q=> q.eq("interviewId", args.interviewId))
		.collect();
		
		return comments;
	}
})