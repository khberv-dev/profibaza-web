import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";
import { pageTransition } from "../lib/motion";

export function PageTransition() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={pageTransition}
        style={{ width: "100%", minHeight: "inherit" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
