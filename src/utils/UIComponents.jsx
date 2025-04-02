import React, { memo } from 'react';

// Reusable SVG icons
export const BackIcon = () => (
  <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const NextIcon = () => (
  <svg className="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const CheckmarkIcon = () => (
  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

export const ErrorIcon = () => (
  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

export const LoadingSpinner = () => (
  <span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-gray-900 rounded-full"></span>
);

// Memoized reusable components
export const StepNavigation = memo(({ step, prevStep, nextStep, totalSteps, selectedDate, selectedTimeSlot }) => (
  <div className="mt-8">
    <div className="flex justify-between items-center">
      {step > 1 && (
        <button
          onClick={prevStep}
          type="button"
          className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
        >
          <BackIcon />
          Back
        </button>
      )}
      {step > 2 && step < totalSteps && (
        <button
          onClick={nextStep}
          type="button"
          className={`ml-auto py-4 px-6 inline-flex items-center gap-x-2 text-base font-semibold rounded-[2rem] border border-transparent bg-[#FFB366] text-gray-900 hover:bg-[#f8a650] disabled:opacity-50 disabled:pointer-events-none ${
            step === 6 && (!selectedDate || !selectedTimeSlot) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={step === 6 && (!selectedDate || !selectedTimeSlot)}
        >
          Continue
          <NextIcon />
        </button>
      )}
    </div>
  </div>
));

export const SolarCounter = memo(({ service, count, numWindows, onDecrease, onIncrease, onChange }) => (
  <div className="flex items-center mt-2">
    <span className="text-sm text-gray-700 mr-3">Number of panels:</span>
    <div className="flex rounded-lg border border-gray-200">
      <button 
        onClick={onDecrease}
        className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-l-lg border-e border-gray-200 bg-gray-50 text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={count <= 1}
      >
        -
      </button>
      <input
        type="number"
        value={count}
        onChange={onChange}
        className="p-0 w-12 bg-transparent border-0 text-center text-gray-900 focus:ring-0"
        min="1"
        max={numWindows}
      />
      <button 
        onClick={onIncrease}
        className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-r-lg border-s border-gray-200 bg-gray-50 text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-50"
        disabled={count >= numWindows}
      >
        +
      </button>
    </div>
    <span className="text-xs text-gray-500 ml-2">max: {numWindows}</span>
  </div>
));

export const ErrorNotification = memo(({ error }) => (
  error && error.trim() !== '' ? (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <ErrorIcon />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  ) : null
));

export const SuccessScreen = memo(({ selectedDate, selectedTimeSlot, formatDate, onReset }) => (
  <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <CheckmarkIcon />
      </div>
      <h2 className="mt-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
      <p className="mt-2 text-gray-600">
        Your booking is confirmed for {formatDate(selectedDate)} at {typeof selectedTimeSlot === 'object' ? selectedTimeSlot.label : selectedTimeSlot}.
      </p>
      <p className="mt-2 text-gray-600">
        We'll send you a confirmation email shortly.
      </p>
      <button
        onClick={onReset}
        className="mt-6 bg-[#FFB366] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#f8a650]"
      >
        Book Another Service
      </button>
    </div>
  </div>
));

// Styling constants
export const BUTTON_STYLES = {
  primary: "py-3 px-6 inline-flex justify-center items-center gap-2 rounded-lg border border-transparent font-semibold bg-[#FFB366] text-gray-900 hover:bg-[#f8a650] focus:outline-none focus:ring-2 focus:ring-[#f8a650] focus:ring-offset-2 transition-all",
  secondary: "py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50",
  disabled: "opacity-70 cursor-not-allowed"
};

export const CARD_STYLES = {
  default: "bg-white border border-gray-200 rounded-xl p-6",
  shadow: "bg-white border border-gray-200 rounded-xl shadow-sm p-6"
};