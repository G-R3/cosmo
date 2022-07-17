import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MdGroups } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../utils/trpc";
import { BiErrorCircle } from "react-icons/bi";

type Inputs = {
  communityName: string;
  communityDescription?: string;
};

const regex = new RegExp("^\\w+$");

const schema = z.object({
  communityName: z
    .string({ required_error: "Community name is required." })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long." })
    .regex(regex, {
      message:
        "Community name most only contain letters, numbers, or underscores.",
    })
    .max(25, { message: "Name must be less than 25 characters long." }),
  communityDescription: z.string().trim().max(500).optional(),
});

const CreateCommunityModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const communityMutation = trpc.useMutation("community.create", {
    onSuccess(data, variables, context) {
      reset({
        communityName: "",
        communityDescription: "",
      });
      setIsOpen(false);
    },
  });

  const createCommunity: SubmitHandler<Inputs> = (data) => {
    communityMutation.mutate({
      name: data.communityName,
      description: data.communityDescription,
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
              className="fixed inset-0 bg-background py-10 bg-opacity-80"
            >
              <Dialog.Panel
                as={motion.div}
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100, transition: { duration: 0.2 } }}
                className="w-full max-w-xl mx-auto rounded bg-whiteAlt dark:bg-darkOne px-10 py-8 relative flex flex-col gap-10"
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
                  {communityMutation.error?.message && (
                    <div className="mt-2 bg-alert p-3 rounded-md text-foreground flex items-center gap-2">
                      <BiErrorCircle size={22} />
                      <p className="text-sm md:text-sm">
                        {communityMutation.error?.message}
                      </p>
                    </div>
                  )}
                  <form
                    id="createCommunity"
                    className="mt-4 flex flex-col gap-10"
                    onSubmit={handleSubmit(createCommunity)}
                  >
                    <div className="flex flex-col gap-2">
                      <label htmlFor="community-name" className="text-md">
                        Name
                      </label>
                      <div className="flex flex-col gap-2">
                        <input
                          id="community-name"
                          defaultValue=""
                          {...register("communityName")}
                          className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-slate-400 dark:bg-darkOne dark:text-foreground"
                        />
                      </div>
                      {errors.communityName?.message && (
                        <span className="text-sm text-alert">
                          {errors.communityName.message}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="community-description"
                        className="text-md"
                      >
                        Description
                        <span className="ml-2 inline-block text-sm text-grayAlt">
                          (Optional)
                        </span>
                      </label>
                      <div className="flex flex-col">
                        <textarea
                          id="community-description"
                          defaultValue=""
                          {...register("communityDescription")}
                          className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md py-3 px-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-slate-400 dark:bg-darkOne dark:text-foreground overflow-hidden min-h-[85px] resize-none overflow-y-auto"
                        ></textarea>
                        {errors.communityDescription?.message && (
                          <span className="text-sm text-alert">
                            {errors.communityDescription.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </form>
                </div>

                <div className="self-end flex gap-2">
                  <button
                    data-cy="close-modal"
                    onClick={() => setIsOpen(false)}
                    className="text-darkOne dark:text-whiteAlt py-4 px-6 h-12 p-4 rounded-md flex items-center border-2 border-transparent disabled:opacity-50 animate-popIn active:hover:animate-none active:focus:animate-none active:focus:scale-95 active:hover:scale-95 transition-all focus-visible:focus:outline focus-visible:focus:border-alert hover:border-alert"
                  >
                    Cancel
                  </button>
                  <button
                    form="createCommunity"
                    data-cy="confirm-create"
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
