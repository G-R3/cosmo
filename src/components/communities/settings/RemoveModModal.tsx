import { trpc } from "@/utils/trpc";
import { FC, useState } from "react";
import { FiUserX } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/common/Button";
import { fadeIn, modalBounceIn } from "@/lib/animations";

const RemoveModModal: FC<{
  userId: string;
  userName: string;
  communityId: string;
}> = ({ userId, userName, communityId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useContext();
  const removeMutation = trpc.useMutation("community.remove-moderator", {
    onSuccess(data, variables, context) {
      setIsOpen(false);
      utils.invalidateQueries(["community.get"]);
    },
  });

  const onDelete = (postId: string, communityId: string) => {
    removeMutation.mutate({ userId, communityId });
  };

  return (
    <>
      <Button
        type="button"
        data-cy="moderator-remove"
        loading={removeMutation.isLoading}
        onClick={() => setIsOpen(true)}
        variant="danger"
        size="sm"
        icon={<FiUserX />}
        ghost
      />

      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeIn}
              className="fixed inset-0 bg-background py-10 bg-opacity-80 z-10"
            >
              <div data-cy="delete-modal" className="flex justify-center p-4">
                <Dialog.Panel
                  as={motion.div}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalBounceIn}
                  className="flex flex-col w-full max-w-xl rounded bg-white dark:bg-darkOne px-10 py-8"
                >
                  <Dialog.Title className="text-2xl">
                    Remove Moderator
                  </Dialog.Title>
                  <Dialog.Description className="mt-2">
                    Are you sure you want to remove {userName} as a moderator?
                  </Dialog.Description>

                  <div className="mt-5 self-end flex gap-2">
                    <Button onClick={() => setIsOpen(false)} size="md" ghost>
                      Cancel
                    </Button>
                    <Button
                      data-cy="confirm-remove"
                      loading={removeMutation.isLoading}
                      onClick={() => onDelete(userId, communityId)}
                      variant="danger"
                      size="md"
                    >
                      Remove
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

export default RemoveModModal;
