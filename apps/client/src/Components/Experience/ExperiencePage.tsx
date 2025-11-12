import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VantaFogBackground from "../VisualOuput/VisualOutput";
import { Button } from "../components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { CustomCursor } from "../CustomCursor";
import gsap from "gsap";

interface RawPetalData {
  id: string;
  text: string;
  day_of_week: string;
  time_of_day: string;
  desired_emotion: string;
  current_emotion: string;
  // Añade más campos si existen
}

type Petal = {
  id: string;
  text: string;
  dayOfWeek: string;
  timeOfDay: string;
  desiredEmotion: string;
  currentEmotion: string;
  createdAt?: string;
};

function ExperiencePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [petal, setPetal] = useState<Petal | null>(null);
  const [isLoading] = useState(false);
  const circleRef = useRef<HTMLDivElement | null>(null);

  const baseURL = `http://localhost:${import.meta.env.VITE_BACKEND_PORT || "8080"}`;

  const gradientColorsAmarillo = useMemo(
    () => ["#FFAA00", "#FF6B00", "#FFD700", "#FFF8DC"],
    []
  );

  const transformPetalData = (data: RawPetalData): Petal => ({
    id: data.id,
    text: data.text,
    dayOfWeek: data.day_of_week,
    timeOfDay: data.time_of_day,
    desiredEmotion: data.desired_emotion,
    currentEmotion: data.current_emotion,
  });

  useEffect(() => {
    const fetchPetal = async () => {
      try {
        const response = await fetch(`${baseURL}/api/petals/${id}`);
        if (!response.ok) throw new Error("Not found");
        const data = await response.json();
        const transformedData = transformPetalData(data);
        console.log(transformedData);
        setPetal(transformedData);
      } catch (err) {
        console.error("Error fetching experience:", err);
      }
    };

    fetchPetal();
  }, [id]);

  useEffect(() => {
    if (circleRef.current) {
      gsap.fromTo(
        circleRef.current,
        {
          scale: 50,
          top: 0,
          left: "50%",
          xPercent: -50,
          yPercent: 0,
          borderRadius: "50%",
          zIndex: 10,
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
        },
        {
          scale: 10,
          top: 1800,
          duration: 2,
          ease: "power2.out",
          borderRadius: "50%",
          backgroundSize: "100% 100%",
          backgroundPosition: "0% 0%",
        }
      );
    }
  }, [petal]);

  const handleGoBack = () => {
    if (circleRef.current) {
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

  console.log("Petal data", petal);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <VantaFogBackground
        dayOfWeek={petal?.dayOfWeek || ""}
        timeOfDay={petal?.timeOfDay || ""}
        currentEmotion={petal?.currentEmotion || ""}
        desiredEmotion={petal?.desiredEmotion || ""}
      />
      <CustomCursor isLoading={isLoading} />
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-white text-center">
        <div className="absolute top-4 left-4">
          <Button onClick={handleGoBack} icon={<ArrowLeftIcon />} />
        </div>
      </div>
      <div
        ref={circleRef}
        className="w-[50px] h-[50px] rounded-full bg-black absolute"
        style={{
          background: `linear-gradient(45deg, ${gradientColorsAmarillo.join(", ")})`,
          backgroundSize: `200% 200%`,
        }}
      />
    </div>
  );
}

export default ExperiencePage;
