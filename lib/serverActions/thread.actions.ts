"use server";

import User from "../models/User.model";
import Thread from "../models/thread.model";
import { revalidatePath } from "next/cache";
import connectToDB from "../mongoose";

interface ThreadData {
  author: string;
  text: string;
  path: string;
}

export const createThread = async ({ author, text, path }: ThreadData) => {
  try {
    connectToDB();
    const thread = await Thread.create({
      thread: text,
      author,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: thread?._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to post the thread." + error.message);
  }
};
