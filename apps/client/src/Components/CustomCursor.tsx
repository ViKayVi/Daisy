import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
import "./customCursor.css";

interface CustomCursorProps {
  isLoading: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isLoading }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isLinkHovered, setIsLinkHovered] = useState<boolean>(false);
  const [cursorOpacity, setCursorOpacity] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;

    if (cursor) {
      document.body.style.cursor = "none";

      const handleMouseMove = (e: MouseEvent) => {
        gsap.to(cursor, {
          duration: 0.15,
          x: e.clientX,
          y: e.clientY,
          overwrite: true,
        });
      };

      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.body.style.cursor = "default";
      };
    }
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    const links = document.querySelectorAll<HTMLAnchorElement>("a"); // Selecciona todos los enlaces

    const handleMouseEnter = () => {
      setIsLinkHovered(true);
      gsap.to(cursor, {
        duration: 0.2,
        scale: 1.5,
        borderWidth: "2px",
        borderColor: "red",
        overwrite: true,
      });
    };

    const handleMouseLeave = () => {
      setIsLinkHovered(false);
      gsap.to(cursor, {
        duration: 0.2,
        scale: 1,
        borderWidth: "1px",
        borderColor: "black",
        overwrite: true,
      });
    };

    links.forEach((link) => {
      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.to(cursorRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });
      setCursorOpacity(1);
    } else {
      setCursorOpacity(0);
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.3,
        overwrite: true,
      });
    }
  }, [isLoading]);

  const cursorStyle = {
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    width: isLinkHovered ? "30px" : "20px",
    height: isLinkHovered ? "30px" : "20px",
    borderColor: isLinkHovered ? "red" : "black",
    opacity: cursorOpacity,
  };

  return (
    <div
      ref={cursorRef}
      id="custom-cursor"
      className={isLinkHovered ? "hovered" : ""}
      style={cursorStyle}
    />
  );
};
