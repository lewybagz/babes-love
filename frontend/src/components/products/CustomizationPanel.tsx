import React from "react";
import { Info } from "lucide-react";

interface CustomizationOption {
  id: string;
  name: string;
  value: string;
  preview?: string;
  thumbnail?: string;
}

interface CustomizationPanelProps {
  productName: string;
  fonts: CustomizationOption[];
  styles: CustomizationOption[];
  selectedFont: string;
  selectedStyle: string;
  onFontSelect: (fontValue: string) => void;
  onStyleSelect: (styleValue: string) => void;
}

const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  productName,
  fonts,
  styles,
  selectedFont,
  selectedStyle,
  onFontSelect,
  onStyleSelect,
}) => {
  const currentFont = fonts.find((font) => font.value === selectedFont);
  const currentStyle = styles.find((style) => style.value === selectedStyle);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Customize Your {productName}
      </h2>

      <div className="mb-8 p-5 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
          Live Preview
        </p>
        <div className="h-48 flex items-center justify-center border border-gray-300 dark:border-gray-500 rounded-md bg-white dark:bg-gray-800 overflow-hidden shadow-inner">
          <div className="text-center px-4">
            <p
              className="text-4xl font-bold text-gray-800 dark:text-white truncate transition-all duration-300"
              style={{ fontFamily: currentFont?.preview || "sans-serif" }}
            >
              Babes Love
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Font: {currentFont?.name || "Default"} | Style:{" "}
              {currentStyle?.name || "Default"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Font
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {fonts.map((font) => (
            <button
              key={font.value}
              type="button"
              className={`p-3 border rounded-md text-center transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 ${
                selectedFont === font.value
                  ? "border-brand bg-brand-50 dark:bg-brand-900/30 dark:border-brand-600 ring-2 ring-brand-300 dark:ring-brand-500 shadow-sm"
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
              onClick={() => onFontSelect(font.value)}
            >
              <span
                className="block text-2xl mb-1 text-gray-800 dark:text-gray-100 group-hover:scale-105 transition-transform"
                style={{ fontFamily: font.preview || "sans-serif" }}
              >
                Aa
              </span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                {font.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Select Style
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {styles.map((style) => (
            <button
              key={style.value}
              type="button"
              className={`p-2 border rounded-md overflow-hidden transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-brand-500 ${
                selectedStyle === style.value
                  ? "border-brand dark:border-brand-600 ring-2 ring-brand-300 dark:ring-brand-500 shadow-sm"
                  : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
              onClick={() => onStyleSelect(style.value)}
            >
              <div
                className={`h-16 mb-2 flex items-center justify-center ${
                  !style.thumbnail ? "bg-gray-100 dark:bg-gray-600" : ""
                } rounded-sm overflow-hidden`}
              >
                {style.thumbnail ? (
                  <img
                    src={style.thumbnail}
                    alt={style.name}
                    className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 p-1 text-center">
                    {style.name}
                  </span>
                )}
              </div>
              <span className="block text-xs font-medium text-gray-600 dark:text-gray-300 text-center">
                {style.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <Info className="w-5 h-5 mr-3 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <span>
            Each <strong>{productName}</strong> is handcrafted with your
            selections. Please allow 1-2 business days for customization before
            shipping.
          </span>
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
