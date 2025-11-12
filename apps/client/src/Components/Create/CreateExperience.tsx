import React, { useState, useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, Eclipse } from "lucide-react";
import { CustomCursor } from "../CustomCursor";
import VantaFogBackground from "../VisualOuput/VisualOutput";

const fields = [
  { id: "currentEmotion", label: "How do you feel?" },
  { id: "desiredEmotion", label: "How do you want to feel?" },
  { id: "text", label: "Name this experience" },
];

const CreateExperience = () => {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState(["", "", ""]);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLFormElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const saveButtonRef = useRef<HTMLButtonElement | null>(null);
  const showVantaRef = useRef<HTMLButtonElement | null>(null);
  const [isLoading] = useState<boolean>(false);
  const currentDay = moment().format("dddd");
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const currentTime = () => {
    const hour = moment().hour();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 18) return "Afternoon";
    if (hour >= 18 && hour < 22) return "Evening";
    return "Night";
  };
  const [desiredEmotion, setDesiredEmotion] = useState("");
  const [currentEmotion, setCurrentEmotion] = useState("");
  const [showVantaAndSave, setShowVantaAndSave] = useState(false);
  const nameInputIndex = fields.findIndex((field) => field.id === "text");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const gradientColorsAmarillo = useMemo(
    () => ["#FFAA00", "#FF6B00", "#FFD700", "#FFF8DC"],
    []
  );

  const [baseURL] = useState(
    `http://localhost:${import.meta.env.VITE_BACKEND_PORT || "8080"}`
  );

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, fields.length);
  }, []);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]!.focus();
    }

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
  }, []);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValues = [...inputValues];
    newValues[index] = e.target.value;
    setInputValues(newValues);
  };

  const handleGoBack = () => {
    if (showVantaAndSave) {
      setShowVantaAndSave(false);
      setCurrentInputIndex(fields.length - 1);
      return;
    }

    if (currentInputIndex > 0 && !showVantaAndSave) {
      const currentElement = containerRef.current?.children[currentInputIndex];
      const previousElement =
        containerRef.current?.children[currentInputIndex - 1];

      if (currentElement && previousElement) {
        gsap.to(currentElement, {
          y: 30,
          opacity: 0,
          duration: 1,
          onComplete: () => {
            setCurrentInputIndex((prevIndex) => prevIndex - 1);
            gsap.fromTo(
              previousElement,
              {
                y: -30,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 2,
                onComplete: () => {
                  inputRefs.current[currentInputIndex - 1]?.focus();
                },
              }
            );
          },
        });
      }
    } else {
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
    }
  };

  useEffect(() => {
    const secondInput = inputRefs.current[1];
    if (!secondInput) return;

    const handleFocus = () => {
      setDesiredEmotion("");
    };

    secondInput.addEventListener("focus", handleFocus);

    return () => {
      secondInput.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    if (!showVantaAndSave && currentInputIndex === nameInputIndex) {
      const inputElement = containerRef.current?.children[nameInputIndex];
      if (inputElement) {
        gsap.fromTo(
          inputElement,
          { y: -30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            onComplete: () => {
              inputRefs.current[nameInputIndex]?.focus();
            },
          }
        );
      }
    }
  }, [showVantaAndSave, currentInputIndex]);

  useEffect(() => {
    if (showVantaAndSave && saveButtonRef.current) {
      gsap.fromTo(
        saveButtonRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, [showVantaAndSave]);

  const handleShowVanta = (e: React.FormEvent) => {
    e.preventDefault();

    const lastInputElement = containerRef.current?.children[nameInputIndex];
    if (inputValues[nameInputIndex].trim() !== "" && lastInputElement) {
      gsap.to(lastInputElement, {
        y: -30,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          setShowVantaAndSave(true);
        },
      });
    }
  };

  const handlePostPetals = async () => {
    const now = moment();
    const dayOfWeek = now.format("dddd");
    let timeOfDay = "";
    const hour = now.hour();

    if (hour >= 5 && hour < 12) {
      timeOfDay = "Morning";
    } else if (hour >= 12 && hour < 18) {
      timeOfDay = "Afternoon";
    } else if (hour >= 18 && hour < 22) {
      timeOfDay = "Evening";
    } else {
      timeOfDay = "Night";
    }

    const petalsData = fields.reduce(
      (acc: { [key: string]: string }, field, index) => {
        acc[field.id] = inputValues[index];
        return acc;
      },
      {}
    );

    const dataToSend = {
      ...petalsData,
      dayOfWeek: dayOfWeek,
      timeOfDay: timeOfDay,
    };

    try {
      const response = await fetch(`${baseURL}/api/petals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Error: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      console.log(data);
      const circle = circleRef.current;

      if (circle) {
        gsap.fromTo(
          circle,
          {
            scale: 10,
            top: 1800,
            left: "50%",
            xPercent: -50,
            yPercent: 0,
            borderRadius: "50%",
            zIndex: 10,
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
          },
          {
            scale: 50,
            top: 0,
            duration: 3,
            ease: "power2.out",
            borderRadius: "50%",
            backgroundSize: "100% 100%",
            backgroundPosition: "0% 0%",
            onComplete: () => {
              if (audioRef.current) {
                gsap.to(audioRef.current, {
                  volume: 0,
                  duration: 1,
                  ease: "power2.out",
                  onComplete: () => {
                    audioRef.current?.pause();
                    navigate("/");
                  },
                });
              } else {
                navigate("/");
              }
            },
          }
        );
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const handleSubmitNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (containerRef.current && currentInputIndex < fields.length - 1) {
      if (currentInputIndex === 0) {
        setCurrentEmotion(inputValues[0]);
        console.log("Current Emotion actualizado al submit:", inputValues[0]);
      }
      if (currentInputIndex === 1) {
        setDesiredEmotion(inputValues[1]);
        console.log("Desired Emotion actualizado al submit:", inputValues[1]);
      }
      gsap.to(containerRef.current.children[currentInputIndex], {
        y: -30,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          setCurrentInputIndex((prevIndex) => prevIndex + 1);
          if (containerRef.current) {
            gsap.fromTo(
              containerRef.current.children[currentInputIndex + 1],
              {
                y: 30,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 1,
                onComplete: () => {
                  if (inputRefs.current[currentInputIndex + 1]) {
                    inputRefs.current[currentInputIndex + 1]!.focus();
                  }
                },
              }
            );
          }
        },
      });
    }
  };

  useEffect(() => {
    if (currentEmotion) {
      const emotionToTrackMap: { [key: string]: string } = {
        sad: "/audio/sad.mp3",
      };

      const normalized = currentEmotion.toLowerCase().trim();
      const matchingTrack =
        emotionToTrackMap[normalized] || "/audio/default.mp3";

      setAudioUrl(matchingTrack);

      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.error("Audio play error:", err);
          });
        }
      }, 1000);
    }
  }, [currentEmotion]);

  console.log("Desired Emotion:", desiredEmotion);
  console.log("Current Emotion:", currentEmotion);

  return (
    <div
      ref={mainContentRef}
      className="h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden"
    >
      {audioUrl && <audio ref={audioRef} src={audioUrl} loop />}
      <VantaFogBackground
        dayOfWeek={currentDay}
        timeOfDay={currentTime()}
        currentEmotion={currentEmotion}
        desiredEmotion={desiredEmotion}
        onBackgroundDarkChange={setIsDarkBackground}
      />
      <CustomCursor isLoading={isLoading} />
      <div className="absolute top-4 left-4">
        <Button
          onClick={handleGoBack}
          icon={<ArrowLeftIcon />}
          isDarkBackground
        />
      </div>
      {!showVantaAndSave ? (
        <form
          onSubmit={handleSubmitNext}
          ref={containerRef}
          className="flex flex-col items-center justify-center w-90 "
        >
          {fields.map((field, index) => (
            <div
              key={field.id}
              style={{
                display: index === currentInputIndex ? "block" : "none",
              }}
              className={
                isDarkBackground
                  ? "mb-4 border-b-2 border-gray-700 w-full"
                  : "mb-4 border-b-2 border-gray-200 w-full"
              }
            >
              <label
                htmlFor={`input${index + 1}`}
                className={
                  isDarkBackground
                    ? "text-black block mb-5 text-sm cursor-none"
                    : "text-gray-200 block mb-5 text-sm cursor-none"
                }
              >
                {field.label}
              </label>
              <div className="mb-1 flex">
                <Input
                  type="text"
                  id={`input${index + 1}`}
                  value={inputValues[index]}
                  onChange={(e) => handleChange(index, e)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                />
                {index < fields.length - 1 && (
                  <Button type="submit" icon={<ArrowRightIcon />} />
                )}
                {index === nameInputIndex && (
                  <Button
                    ref={showVantaRef}
                    type="submit"
                    onClick={handleShowVanta}
                    className="ml-2"
                    icon={<ArrowRightIcon />}
                    isDarkBackground
                  ></Button>
                )}
              </div>
            </div>
          ))}
        </form>
      ) : (
        <div className="absolute top-4 right-4">
          <Button
            ref={saveButtonRef}
            onClick={handlePostPetals}
            icon={<Eclipse />}
            isDarkBackground
          ></Button>
        </div>
      )}
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
};

export default CreateExperience;
