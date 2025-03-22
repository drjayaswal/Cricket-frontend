import { useEffect, useState } from "react";

const Preloader = ({ onComplete }) => {
  const [showDots, setShowDots] = useState(false);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setTextVisible(true); 
    }, 3000); 

    setTimeout(() => {
      setShowDots(true);
    }, 3500);

    setTimeout(() => {
      onComplete();
    }, 4000);
  }, [onComplete]);

  const dotPositions = [
    { top: "-10px", left: "20%" },
    { top: "-10px", right: "20%" },
    { bottom: "-20px", left: "30%" },
    { bottom: "-10px", right: "30%" },
    { left: "-20px", top: "30%" },
    { left: "-10px", bottom: "-20%" },
    { left: "30px", bottom: "-20%" },
    { right: "-10px", top: "-30%" },
    { right: "-10px", bottom: "-30%" },
    { right: "40px", bottom: "-30%" },
    { top: "-20px", left: "50%" },
    { bottom: "-20px", left: "50%" },
    { left: "-30px", top: "50%" },
    { right: "-30px", top: "50%" },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="relative text-6xl font-extrabold uppercase tracking-widest">
        {/* Blue Light Reveal Effect */}
        <div
          className={`relative z-10 bg-clip-text text-transparent ${
            textVisible ? "text-white" : "animate-reveal-text"
          }`}
        >
          Galaxy
        </div>

        {/* White Dots Appear After 3s */}
        {showDots &&
          dotPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-100 animate-dot-fade"
              style={{
                ...pos,
                animationDelay: `${i * 0.2 + 3}s`, // Gradual fade-in
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default Preloader;
