import React from "react";
import { motion } from "framer-motion";

const HomeLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-10">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="w-4 h-4 bg-black dark:bg-white rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeLoader;
