import { Dispatch, SetStateAction, useState } from "react";
import { Dialog } from "@headlessui/react";
import { trpc } from "../utils/trpc";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const communityMutation = trpc.useMutation("community.create");

  const createCommunity = () => {
    communityMutation.mutate({
      name,
      description,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="z-10 relative"
    >
      <div className="fixed inset-0 flex bg-background justify-center py-10 bg-opacity-80">
        <Dialog.Panel
          className="w-full max-w-xl max-h-[530px] rounded bg-white dark:bg-darkOne px-10
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
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  name="community-name"
                  id="community-name"
                  className="p-4 rounded-md bg-whiteAlt text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="community-description" className="text-md">
                  Description
                </label>
                <div className="flex flex-col">
                  <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    className="py-3 px-4 rounded-md bg-whiteAlt text-darkTwo placeholder:text-slate-400 dark:bg-darkTwo dark:text-foreground  focus:outline-offset-2 focus:outline focus:outline-2 focus:outline-darkTwo dark:focus:outline-grayAlt transition-all overflow-hidden min-h-[85px] resize-none"
                  ></textarea>
                  <span className="text-grayAlt">
                    You can always change this later
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="self-end flex gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className=" text-whiteAlt py-4 px-6 h-12 p-4 rounded-md flex items-center border-2 border-transparent disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:border-error hover:border-error"
            >
              Cancel
            </button>
            <button
              onClick={createCommunity}
              disabled={communityMutation.isLoading}
              className="bg-whiteAlt text-darkTwo h-12 p-4 rounded-md flex items-center border-2 border-transparent disabled:opacity-50 disabled:scale-95 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:border-highlight hover:border-highlight"
            >
              Create
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default Modal;
