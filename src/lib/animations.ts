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
      bounce: 0.35,
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
};

export { modalBounceIn };
