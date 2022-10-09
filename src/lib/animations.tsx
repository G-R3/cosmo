const modalBounceIn = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },

  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
};

export { modalBounceIn };
