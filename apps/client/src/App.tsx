import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import AnimatedGradientBackground from "./Components/HomeBackground";
import "./App.css";
import { CustomCursor } from "./Components/CustomCursor";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [startAnimation, setAnimationStart] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const circleRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const svgPlusRef = useRef<HTMLDivElement | null>(null);
  const svgRhombusRef = useRef<SVGSVGElement | null>(null);
  const petalsContainerRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rotationAnimation = useRef<gsap.core.Tween | null>(null);
  const navigate = useNavigate();

  const gradientColors = useMemo(
    () => ["#ADD8E6", "#87CEEB", "#6495ED", "#4682B4"],
    []
  );
  const gradientColorsAmarillo = useMemo(
    () => ["#FFAA00", "#FF6B00", "#FFD700", "#FFF8DC"],
    []
  );

  useEffect(() => {
    const pulse = gsap.to(circleRef.current, {
      scale: 1.3,
      duration: 1.2,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
    });

    const transitionDuration = 0.5;

    const time = setTimeout(() => {
      gsap.to(circleRef.current, {
        scale: 1,
        duration: transitionDuration,
        ease: "power2.out",
        onComplete: () => {
          pulse.kill();
          setShowSplash(false);
          setAnimationStart(true);
          setIsLoading(false);
        },
      });
    }, 7000);

    return () => {
      clearTimeout(time);
      pulse.kill();
    };
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

      const radius = 60;
      const centerX = 0;
      const centerY = 0;
      const deployDuration = 3;
      const orbitDuration = 60;

      petalsRef.current.forEach((petal, index) => {
        if (petal) {
          const angle = (index * 60 * Math.PI) / 180;
          const finalX = centerX + radius * Math.cos(angle);
          const finalY = centerX + radius * Math.sin(angle);

          gsap.fromTo(
            petal,
            {
              x: centerX,
              y: centerY,
              scale: 0.5,
              opacity: 0,
              transformOrigin: "0 0",
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
                  transformOrigin: "0 0",
                });
              },
            }
          );

          const helloSpan = petal.querySelector("span");
          if (helloSpan) {
            helloSpan.addEventListener("mouseenter", () => {
              if (
                rotationAnimation.current &&
                !rotationAnimation.current.paused()
              ) {
                rotationAnimation.current.pause();
              }
            });
            helloSpan.addEventListener("mouseleave", () => {
              if (
                rotationAnimation.current &&
                rotationAnimation.current.paused()
              ) {
                rotationAnimation.current.resume();
              }
            });
          }
        }
      });

      // Animación del gradiente del círculo (similar a AnimatedGradientBackground)
      gsap.to(circleRef.current, {
        backgroundPosition: "100% 0", // O '0 100%' para vertical, etc.
        duration: 10, // Usa la misma duración que tu AnimatedGradientBackground
        repeat: -1,
        ease: "linear",
        yoyo: true,
      });
    }
  }, [startAnimation, gradientColorsAmarillo]);

  const startTransitionAndNavigate = () => {
    gsap.to(circleRef.current, {
      scale: 500,
      duration: 0.7,
      backgroundColor: "black",
      borderRadius: 0,
      ease: "power2.inOut",
      onComplete: () => {
        navigate("/list");
      },
    });
  };

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          ref={circleRef}
          className="w-[50px] h-[50px] rounded-full bg-black"
          style={{
            background: `linear-gradient(45deg, ${gradientColorsAmarillo.join(", ")})`,
            backgroundSize: `200% 200%`,
          }}
        />
      </div>
    );
  }

  const handleRhombusClick = () => {
    startTransitionAndNavigate();
  };

  return (
    <div className="h-screen relative">
      <CustomCursor isLoading={isLoading} />
      <AnimatedGradientBackground colors={gradientColors} duration={10} />
      <div
        className="flex flex-col items-center justify-between h-screen py-12 absolute top-0 left-0 w-full"
        style={{ zIndex: 5, opacity: 1 }}
      >
        <h1 ref={h1Ref} className="">
          DAISY
        </h1>
        <div className="relative w-[100px] h-[100px] flex items-center justify-center">
          <div
            ref={circleRef}
            className="w-[50px] h-[50px] rounded-full bg-black absolute"
            style={{
              background: `linear-gradient(45deg, ${gradientColorsAmarillo.join(", ")})`,
              backgroundSize: `200% 200%`,
            }}
          />
          <div ref={petalsContainerRef}>
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = i * 60;
              return (
                <div
                  key={i}
                  className="absolute w-[30px] h-[30px] flex items-center justify-center"
                  style={{
                    transform: `rotate(${angle}deg) translateX(50px)`,
                    transformOrigin: "0 50%",
                  }}
                  ref={(el) => {
                    if (el) {
                      petalsRef.current[i] = el;
                    }
                  }}
                >
                  <span
                    style={{ transform: `rotate(11deg)` }}
                    className="text-2xl opacity-50 hover:opacity-100 transition-opacity duration-300 border-1 py-1 px-5 rounded-full"
                  >
                    Hello
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2" ref={svgPlusRef}>
          <div>
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="border-1 p-2 rounded-full svg-plus"
            >
              <path
                d="M12 4V20M4 12H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              className="border-1 p-2 rounded-full svg-plus cursor-pointer"
              ref={svgRhombusRef}
              onClick={handleRhombusClick}
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M18 4L32 18L18 32L4 18L18 4Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
