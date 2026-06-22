import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUpItem, staggerContainer } from "../lib/motion";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
};

export function Stagger({ children, className, style, delay = 0.04 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      animate="show"
      variants={staggerContainer(delay)}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, style }: StaggerProps) {
  return (
    <motion.div className={className} style={style} variants={fadeUpItem}>
      {children}
    </motion.div>
  );
}
