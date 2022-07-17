import React, { Dispatch, Fragment, useState, SetStateAction } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "../utils/trpc";

interface Props {
  setValue: Dispatch<SetStateAction<number>>;
}

const SearchCommunity: React.FC<Props> = ({ setValue }) => {
  const [query, setQuery] = useState("");
  const [debouncedValue] = useDebounce(query, 1000);
  const communityQuery = trpc.useQuery(["community.search", { query }], {
    enabled: debouncedValue.trim().length > 0,
  });

  return (
    <Combobox value={query} onChange={setQuery} name="search">
      {({ open }) => (
        <div className="w-full relative">
          <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch />
          </Combobox.Button>
          <Combobox.Input
            name="search-community"
            data-cy="search-communities"
            onChange={(e) => setQuery(e.target.value)}
            displayValue={(community: string) => community}
            autoCapitalize="false"
            autoComplete="false"
            autoCorrect="false"
            placeholder="Search for a community"
            className="w-full p-4 pl-10 bg-whiteAlt text-darkTwo placeholder:text-grayAlt dark:bg-darkOne dark:text-foreground border-2 dark:border-darkTwo focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md"
          />

          <AnimatePresence>
            {open && (
              <Combobox.Options
                as={motion.ul}
                static
                initial={{ opacity: 0, y: "-100" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="max-h-80 overflow-hidden overflow-y-auto border-2 dark:border-darkTwo bg-whiteAlt dark:bg-darkOne p-2 rounded-md absolute z-10 w-full mt-2 shadow-xl"
              >
                {communityQuery.data && communityQuery.data.length > 0 ? (
                  communityQuery.data.map((community) => (
                    <Combobox.Option
                      key={community.id}
                      value={community.name}
                      as={Fragment}
                    >
                      {({ active }) => (
                        <li
                          className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                            active
                              ? "bg-foreground text-darkOne dark:bg-darkTwo dark:text-white"
                              : ""
                          }`}
                          onClick={() => setValue(community.id)}
                        >
                          {community.name}
                        </li>
                      )}
                    </Combobox.Option>
                  ))
                ) : (
                  <p className="text-sm text-center font-semibold py-2">
                    No results. Try something else.
                  </p>
                )}

                {communityQuery.isError && (
                  <p className="text-sm text-center font-semibold py-2">
                    Error {communityQuery.error.message}
                  </p>
                )}
              </Combobox.Options>
            )}
          </AnimatePresence>
        </div>
      )}
    </Combobox>
  );
};

export default SearchCommunity;
