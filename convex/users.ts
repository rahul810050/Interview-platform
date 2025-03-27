import { v } from "convex/values";
import { mutation } from "./_generated/server";



export const syncUser = mutation({
	args: {
		name: v.string(),
		email: v.string(),
		image: v.optional(v.string()),
		clerkId: v.string(),
	},
	handler: async (ctx, args)=> {

	}
})