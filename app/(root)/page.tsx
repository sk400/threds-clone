import { fetchUser } from "@/lib/serverActions/user.actions";
import { UserButton, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  if (!user) return null;

  // data from mongodb

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div>
      <h1>Let's begin</h1>
    </div>
  );
}
