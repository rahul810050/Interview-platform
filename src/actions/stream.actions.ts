"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const streamTokenProvider = async (): Promise<string> => {
  const user = await currentUser();

  if (!user) {
    console.error("User is not authenticated");
    throw new Error("User is not authenticated");
  }

  const streamClient = new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_SECRET_KEY!
  );

  // Correct usage: Pass an object with 'user_id' key
  return streamClient.generateUserToken({ user_id: user.id });
};
