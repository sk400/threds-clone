import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/serverActions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const CreateThread = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const authorDetails = JSON.parse(JSON.stringify(userInfo));

  return (
    <div className="">
      <h1 className="head-text">Create thread</h1>
      <PostThread userId={authorDetails?._id} />
    </div>
  );
};

export default CreateThread;
