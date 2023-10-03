"use server";

import { revalidatePath } from "next/cache";

import User from "../models/User.model";
import connectToDB from "../mongoose";
import { SortOrder, FilterQuery } from "mongoose";
import Thread from "../models/thread.model";

interface UserData {
  userId: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  path: string;
}

export const fetchUser = async (userId: string) => {
  try {
    connectToDB();

    const user = await User.findOne({ id: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch the user data.");
  }
};

export const updateUser = async ({
  userId,
  username,
  name,
  image,
  bio,
  path,
}: UserData) => {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        name,
        username: username.toLowerCase(),
        image,
        bio,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update the user data.");
  }
};

export const fetchUsers = async ({
  userId,
  searchString,
  pageSize,
  pageNumber,
  sortBy = "desc",
}: {
  userId: string;
  searchString: string | undefined;
  pageSize?: number;
  pageNumber?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectToDB();

    const skipAmount = pageSize && pageNumber ? pageSize * (pageNumber - 1) : 0;

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchString) {
      if (searchString?.trim() !== "") {
        const regExp = new RegExp(searchString, "i");

        query.$or = [
          { username: { $regex: regExp } },
          { name: { $regex: regExp } },
        ];
      }
    }

    const userQuery = User.find(query)
      .sort({ createdAt: sortBy })
      .skip(skipAmount);

    if (pageSize) {
      userQuery.limit(pageSize);
    }

    const users = await userQuery.exec();

    const totalUserCounts = await User.countDocuments(query);

    const isNext = totalUserCounts > skipAmount + users?.length;

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch the users.");
  }
};

export const fetchUserThreads = async (accountId: string) => {
  try {
    connectToDB();

    const userThreads = await User.findOne({ id: accountId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "_id id name",
        },
      },
    });

    return userThreads;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch the threads.");
  }
};
