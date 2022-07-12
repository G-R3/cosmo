import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MdGroups } from "react-icons/md";
import { trpc } from "../utils/trpc";

const CreateCommunityModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const communityMutation = trpc.useMutation("community.create", {
    onSuccess(data, variables, context) {
      setName("");
      setDescription("");
      setIsOpen(false);
    },
  });

  const createCommunity = () => {
    communityMutation.mutate({
      name,
      description,
    });
  };

  return (
    <>
      <button
        data-cy="create-community-modal"
        onClick={() => setIsOpen(true)}
        className="flex items-center px-2 h-6 lg:h-8 cursor-pointer"
      >
        <MdGroups size={25} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="z-10 relative"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="fixed inset-0 flex bg-background justify-center py-10 bg-opacity-80"
            >
              <Dialog.Panel
                as={motion.div}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100, transition: { duration: 0.2 } }}
                className="w-full max-w-xl max-h-[550px] rounded bg-whiteAlt dark:bg-darkOne px-10
        py-8 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col gap-2">
                    <Dialog.Title className="text-xl">
                      Create a community
                    </Dialog.Title>
                    <Dialog.Description className={"text-grayAlt"}>
                      Join the fun and create a community of your own
                    </Dialog.Description>
                  </div>
                  <div className="mt-10 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="community-name" className="text-md">
                        Name
                      </label>
                      <div className="flex flex-col gap-2">
                        <input
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          type="text"
                          name="community-name"
                          id="community-name"
                          className="border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-slate-400 dark:bg-darkOne dark:text-foreground"
                        />
                        <div className="flex justify-between text-grayAlt">
                          <span>25 characters max</span>
                          <span
                            className={`${name.length >= 25 && "text-error"}`}
                          >
                            {name.length}/25
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="community-description"
                        className="text-md"
                      >
                        Description
                      </label>
                      <div className="flex flex-col">
                        <textarea
                          onChange={(e) => setDescription(e.target.value)}
                          value={description}
                          className="border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md py-3 px-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-slate-400 dark:bg-darkOne dark:text-foreground overflow-hidden min-h-[85px] resize-none overflow-y-auto"
                        ></textarea>
                        <span className="text-grayAlt">
                          You can always change this later
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="self-end flex gap-2 mt-3">
                  <button
                    data-cy="close-modal"
                    onClick={() => setIsOpen(false)}
                    className="text-darkOne dark:text-whiteAlt py-4 px-6 h-12 p-4 rounded-md flex items-center border-2 border-transparent disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:border-error hover:border-error"
                  >
                    Cancel
                  </button>
                  <button
                    data-cy="confirm-create"
                    onClick={createCommunity}
                    disabled={communityMutation.isLoading}
                    className="bg-whiteAlt border-2 text-darkTwo self-end h-12 p-4 rounded-md flex items-center disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:outline-[3px] focus-visible:focus:outline-highlight"
                  >
                    Create
                  </button>
                </div>
              </Dialog.Panel>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateCommunityModal;
