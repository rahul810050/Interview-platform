import { v } from "convex/values";
import { mutation, query } from "./_generated/server";



export const syncUser = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
		clerkId: v.string(),
	},
	handler: async (ctx, args)=> {
		const existingUser = await ctx.db.query("users")
		.filter(q => q.eq(q.field("clerkId"), args.clerkId)).first();
		
		if(existingUser) return;

		return await ctx.db.insert("users", {
			...args,
			role: "candidate"
		})
	}
})


export const getUsers = query({
	handler: async (ctx)=> {
		const identity = await ctx.auth.getUserIdentity();
		if(!identity) throw new Error("user is not authenticated");

		const users = await ctx.db.query("users").collect();
		return users
	}
})

export const getUserByClerkId = query({
	args: {
		clerkId: v.string()
	},
	handler: async (ctx, args)=> {
		const user = await ctx.db.query("users").filter(q=> q.eq(q.field("clerkId"), args.clerkId)).first();
		if(!user) throw new Error("user not found");
		return user;
	}
})