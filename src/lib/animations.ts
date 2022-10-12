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
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export { modalBounceIn, fadeIn };
