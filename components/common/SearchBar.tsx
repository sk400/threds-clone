"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "../ui/input";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const delayResponse = setTimeout(() => {
      if (search.length > 0) {
        router.push(`/search?q=${search}`);
      } else {
        router.push("/search");
      }

      return () => clearTimeout(delayResponse);
    }, 300);
  }, [search]);

  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search creators"
        className="no-focus searchbar_input"
      />
    </div>
  );
};

export default SearchBar;
