import { useState, FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import { AiOutlineQuestion } from "react-icons/ai";
import Markdown from "./Markdown";
import { fadeIn, modalBounceIn } from "@/lib/animations";

const MarkdownTipsModal: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 text-grayAlt cursor-pointer w-fit"
      >
        Markdown Supported
        <AiOutlineQuestion className="border rounded-full border-grayAlt" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeIn}
              className="fixed inset-0 overflow-y-auto bg-background py-10 bg-opacity-80 z-10"
            >
              <div className="flex justify-center p-4">
                <Dialog.Panel
                  as={motion.div}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={modalBounceIn}
                  className="flex flex-col w-full max-w-xl rounded bg-white dark:bg-darkOne px-10 py-8"
                >
                  <Dialog.Title className="text-2xl">
                    Markdown Help
                  </Dialog.Title>
                  <Dialog.Description className="text-grayAlt">
                    Format your text using markdown. Here are just some quick
                    tips for ya.{" "}
                    <a
                      href="https://www.markdownguide.org/basic-syntax/"
                      target={"_blank"}
                      rel="noreferrer"
                      className="text-blue-500"
                    >
                      Learn more about Markdown
                    </a>
                  </Dialog.Description>

                  <table className="table-auto w-full text-sm text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="px-6 py-3">Type this</th>
                        <th className="px-6 py-3">To get this</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-6 py-3">*italic*</td>
                        <td className="italic px-6 py-3">italic</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3">**bold**</td>
                        <td className="font-bold px-6 py-3">bold</td>
                      </tr>
                      <tr className="border-b">
                        <td className="flex flex-col px-6 py-3 gap-5">
                          <span>* Item list 1</span>
                          <span>* Item list 2</span>
                          <span>* Item list 3</span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-col">
                            <Markdown
                              content={`* item 1\n* item 2\n* item 3`}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3">&gt; Blockquote</td>
                        <td className="px-6 py-3">
                          <Markdown content={"> Blockquote"} />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3">`code`</td>
                        <td className="px-6 py-3">
                          <Markdown content={"`code`"} />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="flex flex-col px-6 py-3">
                          <span>```</span>
                          <span>Write some code</span>
                          <span>```</span>
                        </td>
                        <td className="px-6 py-3">
                          <Markdown content="```Write some code```" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-6 py-3">
                          <span>[A Link](https://google.com)</span>
                        </td>
                        <td className="px-6 py-3">
                          <Markdown content={`[A Link](https://google.com)`} />
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-5 self-end"
                  >
                    Close
                  </button>
                </Dialog.Panel>
              </div>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default MarkdownTipsModal;
