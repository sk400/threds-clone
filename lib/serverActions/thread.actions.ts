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

export const fetchThreads = async (pageSize = 10, pageNumber = 1) => {
  try {
    const skipAmount = pageSize && pageNumber ? (pageNumber - 1) * pageSize : 0;

    const query = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name username image",
        },
      });

    if (pageSize) {
      query.limit(pageSize);
    }

    const threads = await query.exec();

    const totalThreadsCount = await Thread.countDocuments({
      $in: { parentId: [null, undefined] },
    });

    const isNext = totalThreadsCount > skipAmount + threads.length;

    return { isNext, threads };
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch the threads." + error.message);
  }
};

export const fetchThreadById = async (threadId: string) => {
  try {
    connectToDB();

    const query = Thread.findById(threadId);

    query
      .populate({
        path: "author",
        model: User,
        select: "_id id name  image",
      })
      .populate({
        path: "children",
        model: Thread,
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name  image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name  image",
            },
          },
        ],
      });

    const thread = await query.exec();

    return thread;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch the thread." + error.message);
  }
};

export const addCommentToThread = async ({
  threadId,
  userId,
  thread,
  path,
}: {
  threadId: string;
  userId: string;
  thread: string;
  path: string;
}) => {
  try {
    connectToDB();

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User doesn't exists");
    }

    const parentThread = await Thread.findOne({ _id: threadId });

    if (!parentThread) {
      throw new Error("Thread doesn't exists");
    }

    const comment = await Thread.create({
      thread,
      author: userId,
      parentId: threadId,
    });

    parentThread.children.push(comment._id);

    await parentThread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to post the comment" + error.message);
  }
};

export const fetchActivityOnAThread = async (userId: string) => {
  try {
    const allUserThreads = await Thread.find({ author: userId });

    const replies = await Thread.find({
      parentId: {
        $in: allUserThreads.map((thread) => thread._id),
      },
      author: {
        $ne: userId,
      },
    }).populate({
      path: "author",
      model: User,
      select: "image name",
    });

    return replies;
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to fetch the activities" + error.message);
  }
};

export const deleteThread = async () => {
  try {
    connectToDB();

    // delete the thread
    // update user and thread
  } catch (error: any) {
    console.log(error);
    throw new Error("Failed to delete the thread." + error.message);
  }
};
