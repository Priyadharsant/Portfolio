import type { Variants } from 'framer-motion';

// Premium Bezier Curve - used by top design systems (Linear, Vercel, Apple)
// Fast initial acceleration followed by an ultra-smooth gliding deceleration
export const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;
export const SNAPPY_EASE = [0.25, 0.9, 0.3, 1] as const;

// 1. Reveal with subtle 3D lift (perspective, slight pitch rotateX, scale & transform-y)
// Far more modern than just fade/slide, completely avoids blinking or layout thrashing
export const scrollRevealCard: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.97,
    rotateX: 4,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: SMOOTH_EASE,
    },
  },
};

// 2. Dynamic Directional Reveal (Left card entry)
export const scrollRevealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: SMOOTH_EASE,
    },
  },
};

// 3. Dynamic Directional Reveal (Right card entry)
export const scrollRevealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: SMOOTH_EASE,
    },
  },
};

// 4. Staggered Container Orchestration
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// 5. Text / Heading Reveal with Masked Sliding
export const scrollRevealText: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: SMOOTH_EASE,
    },
  },
};

// 6. Pill / Badge Reveal (Pop with micro scale)
export const scrollRevealBadge: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.88,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: SNAPPY_EASE,
    },
  },
};

// 7. Interactive Hover Transition (GPU accelerated)
export const cardHover = {
  y: -6,
  scale: 1.012,
  transition: {
    duration: 0.35,
    ease: [0.33, 1, 0.68, 1],
  },
};

// Backward-compatible exports to avoid breaking references
export const fadeUp = scrollRevealCard;
export const fadeInLeft = scrollRevealLeft;
export const fadeInRight = scrollRevealRight;
export const scaleIn = scrollRevealCard;
