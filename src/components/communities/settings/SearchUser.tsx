import React, { Fragment, useState } from "react";
import Link from "next/link";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "use-debounce";
import { FiSearch, FiX } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { UseFormSetValue, UseFormReset } from "react-hook-form";
import { trpc } from "../../../utils/trpc";

type Inputs = {
  userId: string;
  communityId: string;
};
interface Props {
  setValue: UseFormSetValue<Inputs>;
  reset: UseFormReset<Inputs>;
}

const SearchUser: React.FC<Props> = ({ setValue, reset }) => {
  const [query, setQuery] = useState("");
  const [debouncedValue] = useDebounce(query, 1000);
  const [selectedUser, setSelectedUser] = useState<any>();
  const searchQuery = trpc.useQuery(["user.search", { query }], {
    enabled: debouncedValue.trim().length > 0,
  });

  return (
    <div className={`${selectedUser ? "grid grid-cols-3 gap-2" : ""}`}>
      <Combobox value={query} onChange={setQuery} name="search">
        {({ open }) => (
          <div className="w-full relative col-span-full md:col-span-2">
            <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch />
            </Combobox.Button>
            <Combobox.Input
              name="searchUser"
              data-cy="search-user"
              onChange={(e) => setQuery(e.target.value)}
              displayValue={(user: string) => user}
              autoCapitalize="false"
              autoComplete="false"
              autoCorrect="false"
              placeholder="Search for a user"
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
                  {searchQuery.data && searchQuery.data.users.length > 0 ? (
                    searchQuery.data.users.map((user) => (
                      <Combobox.Option
                        key={user.id}
                        value={user.name}
                        as={Fragment}
                      >
                        {({ active }) => (
                          <li
                            className={`p-2 rounded-md cursor-pointer transition-colors duration-200 ${
                              active
                                ? "bg-foreground text-darkOne dark:bg-darkTwo dark:text-white"
                                : ""
                            }`}
                            onClick={() => {
                              setValue("userId", user.id, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                              setSelectedUser(user);
                            }}
                          >
                            {user.name}
                          </li>
                        )}
                      </Combobox.Option>
                    ))
                  ) : (
                    <p className="text-sm text-center font-semibold py-2">
                      No results. Try something else.
                    </p>
                  )}

                  {searchQuery.isError && (
                    <p className="text-sm text-center font-semibold py-2">
                      Error {searchQuery.error.message}
                    </p>
                  )}
                </Combobox.Options>
              )}
            </AnimatePresence>
          </div>
        )}
      </Combobox>

      {selectedUser && (
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <small>Adding moderator</small>
            <button
              onClick={() => {
                reset();
                setQuery("");
                setSelectedUser(null);
              }}
              className="cursor-pointer hover:bg-whiteAlt dark:hover:bg-darkTwo p-1 rounded-md"
            >
              <FiX />
            </button>
          </div>
          <Link href={`/user/${selectedUser.id}`}>
            <a className="text-highlight font-semibold">{selectedUser.name}</a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SearchUser;
