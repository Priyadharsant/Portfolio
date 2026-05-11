export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

export const cardHover = {
  y: -2,
  transition: {
    type: 'spring',
    stiffness: 180,
    damping: 26,
  },
};
