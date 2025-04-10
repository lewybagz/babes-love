import React from "react";
import CustomHatDesigner from "../components/customizer/CustomHatDesigner";

const CustomizerPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <CustomHatDesigner />
    </div>
  );
};

export default CustomizerPage;
