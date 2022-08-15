import { trpc } from "@/utils/trpc";
import { FC, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Button from "./Button";

const DeletePostModal: FC<{ postId: string }> = ({ postId }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const deleteMutation = trpc.useMutation("post.delete", {
    onSuccess(data, variables, context) {
      setIsOpen(false);
      router.push(`/c/${data.post.community.name}`);
    },
  });

  const onDelete = (postId: string) => {
    deleteMutation.mutate({ postId });
  };

  return (
    <>
      <Button
        variant="danger"
        ghost
        size="lg"
        icon={<FiTrash2 />}
        type="button"
        data-cy="post-delete"
        loading={deleteMutation.isLoading}
        onClick={() => setIsOpen(true)}
      >
        Delete
      </Button>

      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.1 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="fixed inset-0 bg-background py-10 bg-opacity-80 z-10"
            >
              <div data-cy="delete-modal" className="flex justify-center p-4">
                <Dialog.Panel
                  as={motion.div}
                  initial={{ opacity: 0, y: -100 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "tween" } }}
                  exit={{ opacity: 0, y: -100, transition: { duration: 0.2 } }}
                  className="flex flex-col w-full max-w-xl rounded bg-white dark:bg-darkOne px-10 py-8"
                >
                  <Dialog.Title className="text-2xl">Delete Post</Dialog.Title>
                  <Dialog.Description className="mt-2">
                    Deleting a post can&apos;t be undone. Are you sure you want
                    to continue?
                  </Dialog.Description>

                  <div className="mt-5 self-end flex gap-2">
                    <Button onClick={() => setIsOpen(false)} size="md">
                      Cancel
                    </Button>
                    <Button
                      data-cy="confirm-delete-post"
                      loading={deleteMutation.isLoading}
                      onClick={() => onDelete(postId)}
                      variant="danger"
                      size="md"
                    >
                      Delete
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

export default DeletePostModal;
