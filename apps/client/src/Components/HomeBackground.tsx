import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./background.css";

interface AnimatedGradientBackgroundProps {
  colors: string[];
  duration?: number;
  fadeDuration?: number;
  children?: React.ReactNode;
  className?: string;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  colors,
  duration = 10,
  fadeDuration = 5,
  children,
  className,
}) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (backgroundRef.current && colors.length >= 2) {
      gsap.to(backgroundRef.current, {
        backgroundPosition: "100% 0",
        duration: duration,
        repeat: -1,
        ease: "linear",
        yoyo: true,
      });
      gsap.fromTo(
        backgroundRef.current,
        { opacity: 0 },
        { opacity: 1, duration: fadeDuration, ease: "power2.out" }
      );
    }
  }, [colors, duration, fadeDuration]);

  return (
    <div
      ref={backgroundRef}
      className={`animated-gradient-background-component ${className}`}
      style={{
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(45deg, ${colors.join(", ")})`,
        backgroundSize: "400% 400%",
        opacity: 0,
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedGradientBackground;
