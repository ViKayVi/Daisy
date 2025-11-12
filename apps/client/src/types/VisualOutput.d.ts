declare module "../../VisualOutput/VisualOutput.jsx" {
  import React from "react";

  interface VisualOutputProps {
    dayOfWeek: string;
    timeOfDay: string;
    desiredEmotion: string;
  }

  const VisualOutput: React.FC<VisualOutputProps>;
  export default VisualOutput;
}
