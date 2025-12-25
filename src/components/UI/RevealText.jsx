    import React, { useState } from "react";
import { motion } from "framer-motion";

const RevealText = ({ children, delay = 0, className = "" }) => {
  const [c,setC] = useState(0);
  return (
    // 1. The Mask: Hides the text when it is "below" the visible area
    <div style={{ position: "relative", overflow: "hidden", display: "inline-block" }} className={className}>
      
      {/* 2. The Animation: Slides up from y: 100% (hidden) to y: 0% (visible) */}
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }} // Only animate once
        transition={{
          duration: 0.75,
          ease: [0.33, 1, 0.68, 1], // Custom "Cubic Bezier" for that luxury 'snap' feel
          delay: delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RevealText;