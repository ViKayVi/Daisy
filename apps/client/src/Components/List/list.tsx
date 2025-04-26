import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import AnimatedGradientBackground from "../HomeBackground";
import { CustomCursor } from "../CustomCursor";
import gsap from "gsap";

interface ListItem {
  id: number;
  text: string;
}

interface ListProps {
  isLoading?: boolean;
}
export const List: React.FC<ListProps> = ({ isLoading: propIsLoading }) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  // No necesitamos una referencia única para el botón si solo vamos a animar su aparición junto con el texto.
  const [isLoading, setIsLoading] = useState<boolean>(propIsLoading || true);
  const [listData, setListData] = useState<ListItem[]>([]);
  const [baseURL] = useState(
    `http://localhost:${import.meta.env.VITE_BACKEND_PORT || "8080"}`
  );

  const gradientColors = useMemo(
    () => ["#ADD8E6", "#87CEEB", "#6495ED", "#4682B4"],
    []
  );

  const gradientColorsAmarillo = useMemo(
    () => ["#FFAA00", "#FF6B00", "#FFD700", "#FFF8DC"],
    []
  );

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const response = await fetch(`${baseURL}/api/petals`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ListItem[] = await response.json();
        setListData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching list data", error);
        setIsLoading(false);
      }
    };
    fetchListData();
  }, [baseURL]);

  useEffect(() => {
    const circle = circleRef.current;
    const listContainer = listContainerRef.current;

    if (circle) {
      gsap.fromTo(
        circle,
        {
          scale: 50,
          duration: 1,
          borderRadius: 0,
          zIndex: 10,
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
        },
        {
          scale: 1,
          top: "50px",
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          borderRadius: "50%",
          duration: 2,
          ease: "power2.out",
          backgroundSize: "100% 100%",
          backgroundPosition: "0% 0%",
          onComplete: () => {
            if (
              listContainer &&
              listContainer.children &&
              listData.length > 0
            ) {
              gsap.fromTo(
                listContainer.children,
                {
                  opacity: 0,
                  y: 20,
                },
                {
                  opacity: 1,
                  y: 0,
                  stagger: 0.1,
                  duration: 0.6,
                  ease: "power2.out",
                }
              );
            }
          },
        }
      );
    } else if (listContainer && listContainer.children) {
      gsap.fromTo(
        listContainer.children,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        }
      );
    }
  }, [listData]);

  return (
    <div className="h-screen w-full relative  overflow-hidden">
      <CustomCursor isLoading={isLoading} />
      <AnimatedGradientBackground
        colors={gradientColors}
        duration={10}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <div
        ref={circleRef}
        className="w-16 h-16 rounded-full absolute z-10"
        style={{
          background: `linear-gradient(45deg, ${gradientColorsAmarillo.join(", ")})`,
          backgroundSize: "200% 200%",
        }}
      ></div>
      <div
        ref={listContainerRef}
        className="list-container mt-60 px-5 sm:px-10 md:px-20 lg:px-100 relative z-10 flex flex-col gap-4" // Cambiamos a flex-col para apilar los elementos
      >
        {listData.map((item) => (
          <div
            key={item.id}
            className="opacity-0 hover:opacity-100 text-2xl transition-opacity duration-300  flex justify-between items-center" // Añadimos flex para alinear texto y botón
          >
            <div className="border-1 py-1 px-5 rounded-full petals-span">
              {item.text}
            </div>
            <svg
              width="24" // Reducimos el tamaño del botón para que quepa mejor junto al texto
              height="24"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              className="border-1 p-1 rounded-full svg-plus ml-4" // Añadimos margen izquierdo para separarlo del texto
            >
              <circle
                cx="18"
                cy="18"
                r="10" // Reducimos el radio del círculo
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M18 7L29 18L18 29L7 18L18 7Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>
      <Link
        to="/"
        className="mt-8 text-lg text-white relative hover:underline z-10 "
      >
        Volver a Home
      </Link>
    </div>
  );
};
