import React, { useEffect, useState, useRef, useMemo } from "react";
import { MouseEvent, KeyboardEvent } from "react";
import AnimatedGradientBackground from "../HomeBackground";
import { CustomCursor } from "../CustomCursor";
import gsap from "gsap";
import { Button } from "../components/ui/button";
import { ArrowLeftIcon, Check, Ellipsis, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ListItem {
  id: number;
  text: string;
}

interface ListProps {
  isLoading?: boolean;
}

type InputOrButtonEvent =
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLInputElement>;

export const List: React.FC<ListProps> = ({ isLoading: propIsLoading }) => {
  const navigate = useNavigate();
  const circleRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(propIsLoading || true);
  const [listData, setListData] = useState<ListItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

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

  const handleEdit = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleSaveEdit = async (e: InputOrButtonEvent, id: number) => {
    e.preventDefault();

    try {
      const response = await fetch(`${baseURL}/api/petals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: editText }),
      });

      if (!response.ok) {
        throw new Error("Error actualizando el pétalo");
      }

      setListData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, text: editText } : item
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Error actualizando pétalo:", error);
    }
  };

  const handleDelete = async (id: number, index: number) => {
    try {
      const response = await fetch(`${baseURL}/api/petals/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al borrar el pétalo");
      }

      const petalElement = listContainerRef.current?.children[index];

      if (petalElement) {
        gsap.to(petalElement, {
          y: -50,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            setListData((prev) => prev.filter((item) => item.id !== id));
          },
        });
      }

      setListData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error borrando pétalo:", error);
    }
  };

  useEffect(() => {
    const circle = circleRef.current;

    if (circle) {
      gsap.fromTo(
        circle,
        {
          scale: 50,
          duration: 1,
          borderRadius: "50%",
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
        }
      );
    }
  }, []);

  const handleGoBack = () => {
    if (circleRef.current) {
      circleRef.current.style.zIndex = "50";

      gsap.to(circleRef.current, {
        scale: 50,
        top: 0,
        left: "50%",
        xPercent: -50,
        yPercent: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          navigate("/");
        },
      });
    } else {
      navigate("/");
    }
  };

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
        className="list-container mt-60 px-5 sm:px-10 md:px-20 lg:px-100 relative flex flex-col gap-4"
      >
        {listData.map((item, index) => (
          <div
            key={item.id}
            className="text-2xl transition-opacity duration-300 flex justify-between items-center gap-4"
          >
            {editingId === item.id ? (
              <input
                className="border-1 py-1 px-5 rounded-full petals-span text-black"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(e, item.id);
                }}
              />
            ) : (
              <div className="border-1 py-1 px-5 border-gray-700 rounded-full petals-span">
                {item.text}
              </div>
            )}

            <div className="flex gap-2">
              {editingId === item.id ? (
                <Button
                  type="button"
                  onClick={(e) => handleSaveEdit(e, item.id)}
                  icon={<Check />}
                ></Button>
              ) : (
                <Button
                  icon={<Ellipsis />}
                  onClick={() => handleEdit(item.id, item.text)}
                />
              )}
              <Button
                icon={<Trash />}
                onClick={() => handleDelete(item.id, index)}
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={handleGoBack}
        className="mt-8 text-lg flex absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white hover:underline z-10"
        icon={<ArrowLeftIcon />}
      ></Button>
    </div>
  );
};
