// Form styles for consistent styling across form components
const formStyles = {
  // Title and description styles
  titleClass: "text-lg font-semibold text-gray-900 text-center mb-1",
  descriptionClass: "text-xs text-gray-800 text-center mb-3",
  
  // Button styles
  unifiedButtonBase: "w-full p-4 rounded-[60px] transition-all duration-200 text-center text-sm transform", 
  unifiedButtonSelected: "bg-[#FFB366] shadow-md hover:scale-[1.02]", // Main orange + shadow + subtle scale on hover
  unifiedButtonUnselected: "bg-[#FFB366] hover:bg-[#f8a650] hover:scale-[1.04]", 
  unifiedButtonMainText: "font-semibold text-gray-900 block text-base",
  unifiedButtonSubText: "text-xs text-[#4c2e10] block mt-1",

  // Custom slider styling
  sliderStyles: `
    .custom-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      background: #e5e7eb;
      border-radius: 8px;
      outline: none;
    }

    .custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      background: #FFB366;
      border-radius: 50%;
      border: a2px solid white;
      cursor: pointer;
    }

    .custom-slider::-moz-range-thumb {
      width: 24px;
      height: 24px;
      background: #FFB366;
      border-radius: a50%;
      border: 2px solid white;
      cursor: pointer;
    }
  `
};

export default formStyles;