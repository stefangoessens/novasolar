import React from 'react';
import WindowCleaningCalculator from '../components/WindowCleaningCalculator';
import { FaCalculator, FaClock, FaCalendarAlt } from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:flex lg:items-start lg:gap-12 lg:py-28">
            {/* Hero Text */}
            <div className="lg:w-1/2">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Professional</span>
                    <span className="block text-blue-600">Window Cleaning</span>
                    <span className="block">Made Simple</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Get an instant quote for your window cleaning needs. Our easy-to-use calculator helps you estimate costs in seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculator */}
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="mx-auto max-w-lg">
                <WindowCleaningCalculator />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Cleaning Process Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-[#1A3353] sm:text-5xl">
              OUR CLEANING PROCESS
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="relative h-[300px] bg-[#1A3353] rounded-lg overflow-hidden group transition-transform hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">1. SCRUB</h3>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative h-[300px] bg-[#1A3353] rounded-lg overflow-hidden group transition-transform hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">2. DEEP CLEAN</h3>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative h-[300px] bg-[#1A3353] rounded-lg overflow-hidden group transition-transform hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">3. SQUEEGEE</h3>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative h-[300px] bg-[#1A3353] rounded-lg overflow-hidden group transition-transform hover:scale-105">
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-bold text-white">4. DETAIL</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Our Service
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FaCalculator className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Instant Quotes</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get accurate pricing instantly with our smart calculator. No waiting for callbacks.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FaClock className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Time-Saving</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Book your service in minutes. Our streamlined process saves you time and hassle.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  <FaCalendarAlt className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Flexible Scheduling</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Choose from available time slots that work best for your schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Process</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-10">
              {steps.map((step, index) => (
                <div key={step.name} className="relative">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-500 text-white">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-medium text-gray-900">{step.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const steps = [
  {
    name: 'Enter Details',
    description: 'Input your window specifications and requirements.',
  },
  {
    name: 'Get Quote',
    description: 'Receive an instant price calculation based on your inputs.',
  },
  {
    name: 'Choose Time',
    description: 'Select a convenient date and time for the service.',
  },
  {
    name: 'Confirm Booking',
    description: 'Complete your booking with your contact details.',
  },
];

export default LandingPage; 