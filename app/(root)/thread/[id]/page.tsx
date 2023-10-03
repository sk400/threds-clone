import ThreadCard from "@/components/card/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/serverActions/thread.actions";
import { fetchUser } from "@/lib/serverActions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Params {
  params: {
    id: string;
  };
}

const ThreadDetail = async ({ params }: Params) => {
  const user = await currentUser();

  if (!user) return null;

  // data from mongodb

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const thread = await fetchThreadById(params.id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.thread}
          author={thread.author}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
      <div className="mt-7">
        <Comment
          userId={JSON.parse(JSON.stringify(userInfo?._id))}
          threadId={params?.id}
          currentUserImage={userInfo.image}
        />
      </div>
      <div>
        <div className="mt-10">
          {thread.children.map((childItem: any) => (
            <ThreadCard
              key={childItem._id}
              id={childItem._id}
              currentUserId={user.id}
              parentId={childItem.parentId}
              content={childItem.thread}
              author={childItem.author}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              isComment
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ThreadDetail;
