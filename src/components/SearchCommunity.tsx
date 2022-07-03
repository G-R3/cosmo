import React, { Dispatch, Fragment, useState, SetStateAction } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { trpc } from "../utils/trpc";

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const SearchCommunity: React.FC<Props> = ({ value, setValue }) => {
  const [debouncedValue] = useDebounce(value, 1000);

  const communityQuery = trpc.useQuery(["community.search", { query: value }], {
    enabled: debouncedValue.trim().length > 0,
  });

  return (
    <Combobox value={value} onChange={setValue}>
      {({ open }) => (
        <div className="w-full relative">
          <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch />
          </Combobox.Button>
          <Combobox.Input
            data-cy="search-communities"
            onChange={(e) => setValue(e.target.value)}
            displayValue={(community: string) => community}
            autoCapitalize="false"
            autoComplete="false"
            autoCorrect="false"
            placeholder="Search for a community"
            className="w-full p-4 pl-10 rounded-md bg-whiteAlt text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all"
          />

          <AnimatePresence>
            {open && (
              <Combobox.Options
                as={motion.ul}
                static
                initial={{ opacity: 0, y: "-100" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="border-2 bg-foreground dark:bg-darkOne p-2 rounded-md absolute z-10 w-full mt-2
                shadow-xl"
              >
                {communityQuery.data && communityQuery.data.length > 0 ? (
                  communityQuery.data.map((community) => (
                    <Combobox.Option
                      key={community.id}
                      value={community.name}
                      as={Fragment}
                    >
                      {({ active, selected }) => (
                        <li
                          key={community.id}
                          className={`p-2 rounded-md cursor-pointer transition-colors duration-300 ${
                            active &&
                            "bg-whiteAlt text-darkOne dark:bg-darkOne dark:text-white"
                          }`}
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
