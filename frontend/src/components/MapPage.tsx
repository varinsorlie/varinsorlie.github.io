import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import map from "../assets/My_map.png";
import thailand from "../assets/thailand.png"; // add this import

export default function MapPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="fixed inset-0 w-screen h-screen"
      style={{
        background: "var(--background2)",
        backgroundImage: `url(${map})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
      }}
       
    >
      {/* Thailand Image - center bottom */}
      <div className="fixed bottom-0 left-120 -translate-x-1/2 z-10 ">
        <motion.img
          src={thailand}
          alt="Thailand"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          animate={{ scale: isHovered ? 1.3 : 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="cursor-pointer drop-shadow-lg"
          style={{ width: "250px", height: "auto" }}
        />
      </div>
    </div>
  );
}
