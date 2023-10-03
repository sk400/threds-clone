import ThreadCard from "@/components/card/ThreadCard";
import { fetchThreads } from "@/lib/serverActions/thread.actions";
import { fetchUser } from "@/lib/serverActions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (!user) return null;

  // data from mongodb

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const allThreads = await fetchThreads();

  // console.log(allThreads);

  return (
    <div>
      <h1 className="head-text">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {allThreads.threads.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {allThreads.threads.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.thread}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
