import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";
import { interpolateRgb } from "d3-interpolate";

interface VantaFogBackgroundProps {
  dayOfWeek: string;
  timeOfDay: string;
  currentEmotion: string;
  desiredEmotion: string;
  onBackgroundDarkChange?: (isDark: boolean) => void;
}

const VantaFogBackground: React.FC<VantaFogBackgroundProps> = ({
  dayOfWeek = "",
  timeOfDay = "",
  currentEmotion = "",
  desiredEmotion = "",
  onBackgroundDarkChange,
}) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);
  const prevEmotionRef = useRef<string>("");
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const [, setSpeed] = useState<number>(0.7);
  const [zoom, setZoom] = useState(1.5);
  const [highlightColor, setHighlightColor] = useState<number>(
    getDefaultHighlightColorByDay()
  );
  const [midtoneColor, setMidtoneColor] = useState<number>(
    getDefaultMidtoneColorByHour()
  );

  const [baseColor, setBaseColor] = useState<number>(
    getDefaultBaseColorByEmotion()
  );

  function isColorDark(hexColor: number): boolean {
    const r = (hexColor >> 16) & 0xff;
    const g = (hexColor >> 8) & 0xff;
    const b = hexColor & 0xff;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 128;
  }

  function getDefaultHighlightColorByDay(): number {
    const day = (dayOfWeek || "").toLowerCase();
    if (day.includes("monday")) return 0x9b8357;
    if (day.includes("tuesday")) return 0xe33222;
    if (day.includes("wednesday")) return 0x1c4a09;
    if (day.includes("thursday")) return 0x5a6098;
    if (day.includes("friday")) return 0xeda707;
    if (day.includes("saturday")) return 0x3b3bb6;
    if (day.includes("sunday")) return 0xde4110;
    return 0xeeeeee;
  }

  function getDefaultBaseColorByEmotion(): number {
    const current = (currentEmotion || "").toLowerCase();
    if (current.includes("sad")) return 0x110764;
    if (current.includes("angry")) return 0x8e0606;
    if (current.includes("anxious")) return 0x82410d;
    if (current.includes("stressed")) return 0x90ff00;
    if (current.includes("depressed")) return 0x282931;
    return 0xeeeeee;
  }

  function getDefaultMidtoneColorByHour(): number {
    const hour = (timeOfDay || "").toLowerCase();
    if (hour === "morning") return 0xd98d38;
    if (hour === "afternoon") return 0x72c068;
    if (hour === "evening") return 0x5f3bde;
    if (hour === "night") return 0x4b29e8;
    return 0xeeeeee;
  }

  const getColorByEmotion = (emotion: string) => {
    const lower = (emotion || "").toLowerCase();
    if (lower.includes("happy"))
      return { highlight: 0xfff59d, midtone: 0xfff9c4, basecolor: 0xe1842c };
    if (lower.includes("calm"))
      return { highlight: 0xa5d6a7, midtone: 0xc8e6c9, basecolor: 0x0e706a };
    if (lower.includes("excited"))
      return { highlight: 0x9b4f92, midtone: 0xd22743, basecolor: 0xc7f011 };
    if (lower.includes("energized"))
      return { highlight: 0xf48fb1, midtone: 0xfce4ec, basecolor: 0xd72ab7 };
    return {
      highlight: getDefaultHighlightColorByDay(),
      midtone: getDefaultMidtoneColorByHour(),
      basecolor: getDefaultBaseColorByEmotion(),
    };
  };

  const rgbToHex = (rgbString: string): string => {
    const rgb = rgbString.match(/\d+/g)?.map(Number);
    if (!rgb || rgb.length < 3) return "#000000";
    return `#${rgb
      .slice(0, 3)
      .map((val) => val.toString(16).padStart(2, "0"))
      .join("")}`;
  };

  const animateVantaColors = (
    fromHighlight: number,
    toHighlight: number,
    fromMidtone: number,
    toMidtone: number,
    fromBaseColor: number,
    toBaseColor: number,
    vantaEffect: any
  ) => {
    const highlightInterp = interpolateRgb(
      `#${fromHighlight.toString(16).padStart(6, "0")}`,
      `#${toHighlight.toString(16).padStart(6, "0")}`
    );
    const midtoneInterp = interpolateRgb(
      `#${fromMidtone.toString(16).padStart(6, "0")}`,
      `#${toMidtone.toString(16).padStart(6, "0")}`
    );
    const baseInterp = interpolateRgb(
      `${fromBaseColor.toString(16).padStart(6, "0")}`,
      `${toBaseColor.toString(16).padStart(6, "0")}`
    );

    const obj = { t: 0 };

    gsap.to(obj, {
      duration: 5,
      t: 1,
      ease: "sine.inOut",
      onUpdate: () => {
        const currentHighlight = parseInt(
          rgbToHex(highlightInterp(obj.t)).replace("#", ""),
          16
        );
        const currentMidtone = parseInt(
          rgbToHex(midtoneInterp(obj.t)).replace("#", ""),
          16
        );
        const currentBase = parseInt(
          rgbToHex(baseInterp(obj.t)).replace("#", "")
        );
        vantaEffect.setOptions({
          highlightColor: currentHighlight,
          midtoneColor: currentMidtone,
          lowlightColor: currentBase,
        });
      },
    });
  };

  useEffect(() => {
    const emotion = desiredEmotion.toLowerCase();
    const colors = getColorByEmotion(emotion);

    console.log(
      "Inicializando Vanta con baseColor:",
      colors.basecolor.toString(16)
    );

    const dark = isColorDark(colors.basecolor);
    if (onBackgroundDarkChange) {
      onBackgroundDarkChange(dark);
    }

    if (vantaEffect) {
      animateVantaColors(
        highlightColor,
        colors.highlight,
        midtoneColor,
        colors.midtone,
        baseColor,
        colors.basecolor,
        vantaEffect
      );

      gsap.to(vantaEffect.options, {
        duration: 5,
        ease: "sine.inOut",
        speed: emotion.includes("calm")
          ? 0.2
          : emotion.includes("excited")
            ? 2
            : emotion.includes("angry")
              ? 1.5
              : 1,
        zoom: emotion.includes("sad")
          ? 0.5
          : emotion.includes("happy")
            ? 1.2
            : emotion.includes("angry")
              ? 1.05
              : emotion.includes("calm")
                ? 0.9
                : emotion.includes("excited")
                  ? 1.1
                  : zoom,
        onUpdate: () => {
          vantaEffect.setOptions(vantaEffect.options);
        },
      });

      setSpeed(vantaEffect.options.speed);
      setZoom(vantaEffect.options.zoom);
      setHighlightColor(colors.highlight);
      setMidtoneColor(colors.midtone);
      setBaseColor(colors.basecolor);
    }
  }, [vantaEffect, desiredEmotion]);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      const colors = getColorByEmotion(desiredEmotion);
      console.log(colors);
      const effect = FOG({
        el: vantaRef.current,
        THREE,
        highlightColor: colors.highlight,
        midtoneColor: colors.midtone,
        lowlightColor: colors.basecolor,
      });
      vantaEffectRef.current = effect;
      setVantaEffect(effect);
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  const animateSettings = (vanta: any, speed: number, zoom: number) => {
    gsap.to(vanta.options, {
      duration: 5,
      ease: "sine.inOut",
      speed,
      zoom,
      onUpdate: () => {
        vanta.setOptions(vanta.options);
      },
    });
  };

  useEffect(() => {
    const vanta = vantaEffectRef.current;
    if (!vanta) return;

    const current = currentEmotion.toLowerCase();
    const prev = prevEmotionRef.current;

    if (current && current !== prev) {
      const fromColors = getColorByEmotion(prev);
      const toColors = getColorByEmotion(current);
      animateVantaColors(
        fromColors.highlight,
        toColors.highlight,
        fromColors.midtone,
        toColors.midtone,
        fromColors.basecolor,
        toColors.basecolor,
        vanta
      );

      const speed = current.includes("calm")
        ? 0.2
        : current.includes("excited")
          ? 2
          : current.includes("angry")
            ? 1.5
            : 1;

      const zoom = current.includes("sad")
        ? 0.5
        : current.includes("happy")
          ? 1.2
          : current.includes("angry")
            ? 1.05
            : current.includes("calm")
              ? 0.9
              : current.includes("excited")
                ? 1.1
                : 1;

      animateSettings(vanta, speed, zoom);

      prevEmotionRef.current = current;
    }
  }, [vantaEffect, currentEmotion]);

  return (
    <div
      ref={vantaRef}
      className="w-full h-screen fixed top-0 left-0 z-[-1]"
    ></div>
  );
};

export default VantaFogBackground;
