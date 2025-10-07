import React from "react";

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 5,
  color = "text-gray-500",
}) => {
  const colorClass = color.startsWith("text-") ? color : "text-gray-500";
  const colorStyle = !color.startsWith("text-") ? { color: color } : {};

  return (
    <svg
      // Apply the default text color class if not using inline style
      className={`animate-spin h-${size} w-${size} ${
        color.startsWith("#") ? "" : colorClass
      }`}
      style={colorStyle} // Apply inline style for custom hex colors
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export default Spinner;
