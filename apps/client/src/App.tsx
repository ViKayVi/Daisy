import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import AnimatedGradientBackground from "./Components/HomeBackground";
import { CustomCursor } from "./Components/CustomCursor";
import "./App.css";
import { Button } from "./Components/components/ui/button";
import { Flower, Plus } from "lucide-react";

interface Petal {
  id: number;
  text: string;
  dayOfWeek: string;
  timeOfDay: string;
  desiredEmotion: string;
}

function App() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [startAnimation, setAnimationStart] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const circleRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const svgPlusRef = useRef<HTMLDivElement | null>(null);
  const petalsContainerRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<(HTMLDivElement | null)[]>([]);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const rotationAnimation = useRef<gsap.core.Tween | null>(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  const [petalsData, setPetalsData] = useState<Petal[]>([]);
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
    const circle = circleRef.current;
    const pulseScale = 1.3;
    const pulseDuration = 1.2;
    const transitionDuration = 2;

    if (circle && !animationStarted) {
      setAnimationStarted(true);
      gsap.fromTo(
        circle,
        { scale: 50 },
        {
          scale: 1,
          duration: transitionDuration,
          ease: "power2.out",
          onComplete: () => {
            const pulse = gsap.to(circle, {
              scale: pulseScale,
              duration: pulseDuration,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            });

            const time = setTimeout(() => {
              gsap.to(circle, {
                scale: 1,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                  pulse.kill();
                  setShowSplash(false);
                  setAnimationStart(true);
                  setIsLoading(false);
                },
              });
            }, 2000);

            return () => {
              clearTimeout(time);
              pulse.kill();
            };
          },
        }
      );
    }
  }, []);

  useEffect(() => {
    if (startAnimation) {
      gsap.fromTo(
        h1Ref.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: "power3.out" }
      );
      gsap.fromTo(
        svgPlusRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: "power3.out" }
      );

      rotationAnimation.current = gsap.to(petalsContainerRef.current, {
        rotation: -360,
        duration: 60,
        repeat: -1,
        ease: "linear",
        transformOrigin: "center center",
      }) as gsap.core.Tween;

      const radius = 40;
      const centerX = 0;
      const centerY = 0;
      const deployDuration = 3;
      const orbitDuration = 60;

      petalsRef.current.forEach((petal, index) => {
        if (petal) {
          const angle =
            (index * (360 / (petalsData.length || 6)) * Math.PI) / 180;
          const finalX = centerX + radius * Math.cos(angle);
          const finalY = centerX + radius * Math.sin(angle);

          gsap.fromTo(
            petal,
            {
              x: centerX,
              y: centerY,
              scale: 0.5,
              opacity: 0,
              transformOrigin: "0 50%",
            },
            {
              duration: deployDuration,
              x: finalX,
              y: finalY,
              scale: 1,
              opacity: 1,
              ease: "power3.out",
              delay: 0.2 * index,
              onComplete: () => {
                gsap.to(petal, {
                  duration: orbitDuration,
                  repeat: -1,
                  ease: "linear",
                  x: finalX,
                  y: finalY,
                  transformOrigin: "0 50%",
                });
              },
            }
          );

          const petalSpan = petal.querySelector("span");
          if (petalSpan) {
            gsap.set(petalSpan, {
              rotation: 2,
              transformOrigin: "left center",
            });

            petalSpan.addEventListener("mouseenter", () => {
              if (rotationAnimation.current) {
                rotationAnimation.current.pause();
              }
            });
            petalSpan.addEventListener("mouseleave", () => {
              if (rotationAnimation.current) {
                rotationAnimation.current.resume();
              }
            });
          }
        }
      });

      gsap.to(circleRef.current, {
        backgroundPosition: "100% 0",
        duration: 10,
        repeat: -1,
        ease: "linear",
        yoyo: true,
      });
    }
  }, [startAnimation, gradientColorsAmarillo, petalsData]);

  const handleGoToList = () => {
    const circle = circleRef.current;
    const mainContent = mainContentRef.current;
    if (circle) {
      gsap.to(circle, {
        scale: 50,
        duration: 2,
        borderRadius: 0,
        zIndex: 10,
        backgroundSize: "100% 100%",
        backgroundPosition: "center center",
        onComplete: () => {
          gsap.set(mainContent, { opacity: 0, display: "none" });
          navigate("/list");
        },
      });
    }
  };

  const handleGoToExperience = (petal: Petal) => {
    const circle = circleRef.current;
    const mainContent = mainContentRef.current;

    if (circle) {
      gsap.to(circle, {
        scale: 50,
        duration: 2,
        borderRadius: 0,
        zIndex: 10,
        backgroundSize: "100% 100%",
        backgroundPosition: "center center",
        onComplete: () => {
          gsap.set(mainContent, { opacity: 0, display: "none" });
          navigate(`/experience/${petal.id}`);
        },
      });
    }
  };

  const handleGoToCreate = () => {
    const circle = circleRef.current;
    const mainContent = mainContentRef.current;

    if (circle) {
      gsap.to(circle, {
        scale: 50,
        duration: 2,
        borderRadius: 0,
        zIndex: 10,
        backgroundSize: "100% 100%",
        backgroundPosition: "center center",
        onComplete: () => {
          gsap.set(mainContent, { opacity: 0, display: "none" });
          navigate("/create");
        },
      });
    }
  };

  useEffect(() => {
    const fetchPetals = async () => {
      try {
        const response = await fetch(`${baseURL}/api/petals`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPetalsData(data);
      } catch (error) {
        console.error("Error fetching petals", error);
      }
    };

    fetchPetals();
  }, [baseURL]);

  return (
    <div className="h-screen relative">
      <CustomCursor isLoading={isLoading} />
      <AnimatedGradientBackground colors={gradientColors} duration={10} />
      <div
        ref={mainContentRef}
        className="flex flex-col items-center justify-between h-screen py-6 absolute top-0 left-0 w-full"
        style={{ zIndex: 5, opacity: 1 }}
      >
        <h1
          ref={h1Ref}
          className="border-1 border-black py-1 px-5 rounded-full"
          style={{ opacity: showSplash ? 0 : 1 }}
        >
          DAISY
        </h1>
        <div className="relative w-[100px] h-[100px] flex items-center justify-center">
          <div
            ref={circleRef}
            className="w-[50px] h-[50px] rounded-full bg-black absolute"
            style={{
              background: `linear-gradient(45deg, ${gradientColorsAmarillo.join(", ")})`,
              backgroundSize: `200% 200%`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            ref={petalsContainerRef}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: showSplash ? 0 : 1,
              width: "0px",
              height: "0px",
            }}
          >
            {petalsData.map((petal, i) => {
              const angle = i * (360 / (petalsData.length || 6));
              return (
                <div
                  key={petal.id}
                  className="absolute w-[30px] h-[30px] flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "center center",
                  }}
                  ref={(el) => {
                    if (el) {
                      petalsRef.current[i] = el;
                    }
                  }}
                >
                  <span
                    onClick={() => handleGoToExperience(petal)}
                    style={{
                      transform: `rotate(1deg) translateX(45px)`,
                      whiteSpace: "nowrap",
                      fontSize: "1rem",
                    }}
                    className="opacity-50 hover:opacity-100 transition-opacity duration-300 border-1 border-black py-1 px-5 rounded-full petals-span"
                  >
                    {petal.text || "Empty slot"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div
          className="flex gap-1"
          ref={svgPlusRef}
          style={{ opacity: showSplash ? 0 : 1 }}
        >
          <Button onClick={handleGoToCreate} icon={<Plus />} />
          <Button onClick={handleGoToList} icon={<Flower />} />
        </div>
      </div>
    </div>
  );
}

export default App;
