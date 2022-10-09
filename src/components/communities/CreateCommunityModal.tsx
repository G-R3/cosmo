import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MdGroups } from "react-icons/md";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BiErrorCircle } from "react-icons/bi";
import { trpc } from "../../utils/trpc";
import TextareaAutosize from "../common/TextareaAutosize";
import Button from "../common/Button";
import Alert from "../common/Alert";
import { modalBounceIn } from "@/lib/animations";

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
  communityDescription: z
    .string()
    .trim()
    .max(200, { message: "Description must be less than 200 characters" })
    .optional(),
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
      communityName: data.communityName,
      communityDescription: data.communityDescription,
    });
  };

  return (
    <>
      <Button
        data-cy="create-community-modal"
        onClick={() => setIsOpen(true)}
        icon={<MdGroups size={25} />}
      />
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
              className="fixed inset-0 bg-background py-10 bg-opacity-80 z-10"
            >
              <div
                data-cy="create-commmunity-modal"
                className="flex justify-center p-4"
              >
                <Dialog.Panel
                  as={motion.div}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalBounceIn}
                  className="flex flex-col w-full max-w-xl rounded bg-white dark:bg-darkOne px-10 py-8"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                      <Dialog.Title className="text-xl">
                        Create a community
                      </Dialog.Title>
                      <Dialog.Description className={"text-grayAlt"}>
                        Join the fun and create a community of your own
                      </Dialog.Description>
                    </div>
                    {communityMutation.error?.message && (
                      <Alert type="error">
                        <BiErrorCircle size={22} />
                        {communityMutation.error?.message}
                      </Alert>
                    )}
                    <form
                      id="createCommunity"
                      className="flex flex-col gap-10"
                      onSubmit={handleSubmit(createCommunity)}
                    >
                      <div className="flex flex-col gap-2">
                        <label htmlFor="community-name">Name</label>
                        <div className="flex flex-col gap-2">
                          <input
                            data-cy="community-name"
                            id="community-name"
                            defaultValue=""
                            {...register("communityName")}
                            className="w-full border-2 focus:outline-none focus:border-grayAlt dark:focus:border-grayAlt rounded-md p-4 bg-whiteAlt dark:border-darkTwo text-darkTwo placeholder:text-slate-400 dark:bg-darkOne dark:text-foreground"
                          />
                        </div>
                        {errors.communityName?.message && (
                          <span
                            data-cy="community-name-error"
                            className="text-sm text-alert"
                          >
                            {errors.communityName.message}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="community-description">
                          Description
                          <span className="ml-2 inline-block text-sm text-grayAlt">
                            (Optional)
                          </span>
                        </label>
                        <div className="flex flex-col">
                          <TextareaAutosize
                            data-cy="community-description"
                            id="community-description"
                            register={register("communityDescription")}
                            minHeight={100}
                          />
                          {errors.communityDescription?.message && (
                            <span
                              data-cy="community-description-error"
                              className="text-sm text-alert"
                            >
                              {errors.communityDescription.message}
                            </span>
                          )}
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="self-end flex gap-2">
                    <Button
                      data-cy="close-modal"
                      size="md"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      form="createCommunity"
                      data-cy="confirm-create"
                      variant="primary"
                      loading={communityMutation.isLoading}
                      size="md"
                    >
                      Create
                    </Button>
                  </div>
                </Dialog.Panel>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateCommunityModal;
