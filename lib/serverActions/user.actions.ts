"use server";

import { revalidatePath } from "next/cache";

import User from "../models/User.model";
import connectToDB from "../mongoose";

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
    await connectToDB();

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
    await connectToDB();

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
