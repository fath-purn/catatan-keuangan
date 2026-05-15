"use client";

import { FiSearch } from "react-icons/fi";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="bg-white/20 border-2 border-transparent focus-within:border-white rounded-2xl flex items-center px-4 py-3 transition-colors mt-2">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <FiSearch className="w-5 h-5 text-white mr-3" />
      <input
        className="bg-transparent border-none outline-none text-white placeholder-white/80 font-bold w-full text-sm"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
    </div>
  );
}
