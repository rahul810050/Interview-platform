import { httpRouter } from "convex/server";
import {httpAction} from "./_generated/server"
import { request } from "http";
import {Webhook} from 'svix'
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";


const http = httpRouter();

http.route({
	path: "/clerk-webhook",
	method: "POST",
	handler: httpAction(async (ctx, req) => {
		const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
		if (!webhookSecret) {
			throw new Error("Missing CLERK_WEBHOOK_SECRET");
		}
		const svix_id = req.headers.get("svix-id");
		const svix_signature = req.headers.get("svix-signature");
		const svix_timestamp = req.headers.get("svix-timestamp");
		if (!svix_id || !svix_signature || !svix_timestamp) {
			return new Response("No svix headers found", { status: 400 });
		}
		
		const payload = await req.json();
		const body = JSON.stringify(payload);

		const wh = new Webhook(webhookSecret);
		let evt: WebhookEvent;

		try{
			evt = wh.verify(body, {
				"svix-id": svix_id,
				"svix-signature": svix_signature,
				"svix-timestamp": svix_timestamp,
			}) as WebhookEvent;
		} catch(err){
			console.log("error while verifying webhook", err);
			return new Response("Invalid webhook signature", { status: 400 });
		}

		const eventType = evt.type;
		if(eventType === "user.created"){
			const { id, email_addresses, first_name, last_name, image_url} = evt.data;
			const email = email_addresses[0].email_address;
			const fullname = `${first_name || ""} ${last_name || ""}`;

			try{
				await ctx.runMutation(api.users.syncUser, {
					clerkId: id,
					email,
					name: fullname,
					image: image_url
				})
			} catch(err){
				console.log("error while syncing user", err);
				return new Response("Error while syncing user", { status: 500 });
			}
		}
		return new Response("webhook process successfully created", { status: 200 }); // 44 min
	})
})