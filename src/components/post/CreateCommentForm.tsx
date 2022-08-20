import { SubmitHandler, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BiErrorCircle } from "react-icons/bi";
import { useRouter } from "next/router";
import Alert from "../common/Alert";
import Button from "../common/Button";
import MarkdownTipsModal from "../common/MarkdownTipsModal";
import TextareaAutosize from "../common/TextareaAutosize";
import { FC } from "react";
import { trpc } from "@/utils/trpc";

type Inputs = {
  postId: string;
  commentContent: string;
};

const schema = z.object({
  postId: z.string(),
  commentContent: z
    .string()
    .trim()
    .min(1, { message: "Comment can't be empty" })
    .max(500, { message: "Comment must be less than 500 characters" }),
});

const CreateCommentForm: FC<{ postId: string }> = ({ postId }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<Inputs>({
    defaultValues: { commentContent: "", postId },
    resolver: zodResolver(schema),
  });
  const { data: session } = useSession();
  const router = useRouter();
  const utils = trpc.useContext();
  const commentMutation = trpc.useMutation("comment.create", {
    onSuccess(data, variables, context) {
      utils.invalidateQueries(["post.get-by-id"]);
      utils.invalidateQueries(["comment.get-by-postId"]);
      reset({
        commentContent: "",
        postId,
      });
    },
  });

  console.log(errors);

  const createComment: SubmitHandler<Inputs> = (data) => {
    commentMutation.mutate({
      postId: data.postId,
      content: data.commentContent,
    });
  };

  return (
    <section className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <h2 className="text-md">Post a comment</h2>
        {commentMutation.error && (
          <Alert type="error">
            <BiErrorCircle size={22} />
            <span>Oh no! change a few things up and try again</span>
          </Alert>
        )}
      </div>
      <form
        id="createComment"
        className="flex flex-col gap-2 mb-3"
        onSubmit={handleSubmit(createComment)}
      >
        <div className="flex justify-between items-center flex-wrap text-sm">
          <MarkdownTipsModal />
          {errors.commentContent?.message && (
            <span data-cy="form-error" className="text-alert">
              {errors.commentContent.message}
            </span>
          )}
        </div>
        <TextareaAutosize
          data-cy="comment-textarea"
          id="comment"
          placeholder="What are you thoughts?"
          minHeight={150}
          register={register("commentContent")}
        />
      </form>
      <div className="flex justify-end">
        {session?.user ? (
          <Button
            form="createComment"
            data-cy="create-comment"
            variant="primary"
            size="md"
            loading={commentMutation.isLoading}
            disabled={!isDirty || !!errors.commentContent}
          >
            Post
          </Button>
        ) : (
          // TODO: Add login modal. it sucks having to redirect to login page.
          <Button
            onClick={() => router.push("/signin")}
            loading={commentMutation.isLoading}
            disabled={!isDirty || !!errors.commentContent}
            variant="primary"
            size="md"
          >
            Post
          </Button>
        )}
      </div>
    </section>
  );
};

export default CreateCommentForm;
