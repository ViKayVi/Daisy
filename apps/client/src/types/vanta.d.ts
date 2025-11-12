declare module "vanta/dist/vanta.fog.min" {
  import * as THREE from "three";

  interface FogSettings {
    el: HTMLElement | string;
    THREE: typeof THREE;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    highlightColor?: number;
    midtoneColor?: number;
    lowlightColor?: number;
    baseColor?: number;
    blurFactor?: number;
    speed?: number;
    zoom?: number;
  }

  type Effect = {
    destroy: () => void;
    setOptions: (options: Partial<FogSettings>) => void;
  };

  const FOG: (settings: FogSettings) => Effect;
  export default FOG;
}
