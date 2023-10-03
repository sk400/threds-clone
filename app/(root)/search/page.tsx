import UserCard from "@/components/card/UserCard";
import SearchBar from "@/components/common/SearchBar";
import { fetchUser, fetchUsers } from "@/lib/serverActions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: { [key: string]: string | undefined };
}

const SearchPage = async ({ searchParams }: SearchParams) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId: user.id,
    searchString: searchParams?.q,
    pageNumber: 1,
    pageSize: 10,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <SearchBar />

      <div className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
