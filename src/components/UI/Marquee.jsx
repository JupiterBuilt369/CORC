import React from "react";
import { motion } from "framer-motion";

const Marquee = ({ text, speed = 20, className = "" }) => {
  return (
    <div className={`w-full overflow-hidden flex items-center ${className}`}>
      {/* We render the text block multiple times to ensure the loop 
        is seamless regardless of screen width.
      */}
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: "-50%" }}
        transition={{
          ease: "linear",
          duration: speed, // Lower number = Faster speed
          repeat: Infinity,
        }}
      >
        {/* We repeat the content 4 times to be safe on ultra-wide monitors */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center mx-4">
            <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-4">
              {text}
            </span>
            {/* Separator Icon (Star) */}
            <span className="text-yellow-500 text-2xl mx-4">★</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;