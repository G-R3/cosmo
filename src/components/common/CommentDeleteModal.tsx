import { trpc } from "@/utils/trpc";
import { FC, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../common/Button";

const DeleteCommentModal: FC<{ commentId: string }> = ({ commentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const utils = trpc.useContext();
  const deleteMutation = trpc.useMutation("comment.delete", {
    onSuccess(data, variables, context) {
      setIsOpen(false);
      utils.invalidateQueries("comment.get-by-postId");
      utils.invalidateQueries("user.get-comments");
    },
  });

  const onDelete = (commentId: string) => {
    deleteMutation.mutate({ commentId });
  };

  return (
    <>
      <Button
        data-cy="comment-delete"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-grayAlt hover:text-alert"
      >
        <FiTrash2 />
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
                    Deleting a comment can&apos;t be undone. Are you sure you
                    want to continue?
                  </Dialog.Description>

                  <div className="mt-5 self-end flex gap-2">
                    <Button onClick={() => setIsOpen(false)} size="md" ghost>
                      Cancel
                    </Button>
                    <Button
                      data-cy="confirm-delete-comment"
                      loading={deleteMutation.isLoading}
                      onClick={() => onDelete(commentId)}
                      variant="danger"
                      size="md"
                    >
                      {deleteMutation.isLoading ? "Deleting..." : "Delete"}
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

export default DeleteCommentModal;
