import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/serverActions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  // data from session
  const user = await currentUser();

  if (!user) return null;

  // data from mongodb

  const userInfo = await fetchUser(user.id);

  if (userInfo?.onboarded) {
    redirect("/");
  }

  const userData = {
    userId: user.id,
    username: userInfo?.username ? userInfo?.username : user.username,
    name: userInfo?.name ? userInfo?.name : user.firstName,
    image: userInfo?.image ? userInfo?.image : user.imageUrl,
    bio: userInfo?.bio ? userInfo?.bio : "",
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Threds.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile btnTitle="Continue" userData={userData} />
      </section>
    </main>
  );
};

export default page;
