import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBooking } from '../services/bookingService';

// Import step components
import StepOne from './FormSteps/StepOne';
import StepTwo from './FormSteps/StepTwo';
import StepThree from './FormSteps/StepThree';
import StepFour from './FormSteps/StepFour';
import StepFive from './FormSteps/StepFive';
import StepNavigation from './FormSteps/StepNavigation';
import formStyles from './FormSteps/formStyles';

const SolarCalculator = () => {
  // Navigation hook for redirecting
  const navigate = useNavigate();

  // States for calculator
  const [numStories, setNumStories] = useState(null);
  const [cleaningType, setCleaningType] = useState(null);
  const [numWindows, setNumWindows] = useState(25); // Used for energy consumption/system size
  const [additionalServices, setAdditionalServices] = useState({});
  const [step, setStep] = useState(1);
  const totalSteps = 5; // Total steps in form
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simplified helper for form submission
  const prepareSubmissionData = () => {
    // Make sure personal details are properly formatted and validated
    const validatedPersonalDetails = {
      name: personalDetails.name.trim(),
      email: personalDetails.email.trim(),
      phone: personalDetails.phone.trim(),
      address: personalDetails.address.trim()
    };
    
    return {
      serviceType: cleaningType,
      roofType: numStories, 
      energyConsumption: numWindows * 100, // Convert to kWh based on selected option
      additionalOptions: additionalServices,
      personalDetails: validatedPersonalDetails,
      // Add more metadata to help with CRM integration
      metadata: {
        submissionDate: new Date().toISOString(),
        source: 'website_form',
        campaign: 'solar_calculator'
      }
    };
  };

  // Handler functions
  const nextStep = () => {
    setError('');
    // Skip validation for most steps as they auto-advance with buttons
    
    // Only validate personal details in step 5
    if (step === 5 && (!personalDetails.name || !personalDetails.phone || !personalDetails.email || !personalDetails.address)) {
      setError('Vul alstublieft alle gegevens in.');
      return;
    }
    
    setStep(Math.min(step + 1, totalSteps));
  };

  const prevStep = () => {
    setError('');
    setStep(Math.max(step - 1, 1));
  };

  const handleServiceChange = (service) => {
    setAdditionalServices(prevServices => {
      const newServices = { ...prevServices };
      const currentService = newServices[service]; 
      const isSelected = !currentService.selected;
      const newCount = isSelected ? numWindows : 0;
      // Keep price from initial state (which uses hardcoded const)
      newServices[service] = { ...currentService, selected: isSelected, count: Math.max(0, newCount) }; 
      return newServices;
    });
  };

  const handleServiceCountChange = (service, count) => {
    setAdditionalServices(prevServices => {
      const newServices = { ...prevServices };
      newServices[service].count = Math.max(1, Math.min(count, numWindows));
      return newServices;
    });
  };

  const handlePersonalDetailChange = (field, value) => {
    setPersonalDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleBookingConfirm = async () => {
    if (!personalDetails.name || !personalDetails.phone || !personalDetails.email || !personalDetails.address) {
      setError('Vul alstublieft alle gegevens in');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Starting form submission process...');
      const formData = prepareSubmissionData();
      console.log('Prepared form data:', formData);
      
      // Debug log for form submission
      console.log('Submitting form data to booking service...');
      
      const result = await saveBooking(formData);
      console.log('Submission successful! Result:', result);
      
      // Redirect to thank you page
      navigate('/bedankt');
    } catch (err) {
      console.error('Submission Error:', err);
      
      // More detailed error message for debugging
      if (err.response) {
        console.error('API Error Response:', err.response.data);
        console.error('API Error Status:', err.response.status);
        setError(`API Error (${err.response.status}): ${err.response.data.error || 'Unknown error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Er kon geen verbinding worden gemaakt met de server. Controleer uw internetverbinding.');
      } else {
        console.error('Error details:', err.message);
        setError('Er is een fout opgetreden. Probeer het opnieuw.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1: // Service Type Selection
        return (
          <StepOne 
            cleaningType={cleaningType} 
            setCleaningType={setCleaningType} 
            nextStep={nextStep} 
            styles={formStyles} 
          />
        );

      case 2: // Configuration based on service type
        return (
          <StepTwo 
            cleaningType={cleaningType} 
            numStories={numStories} 
            setNumStories={setNumStories} 
            nextStep={nextStep} 
            styles={formStyles} 
          />
        );

      case 3: // House age or system specific questions
        return (
          <StepThree 
            cleaningType={cleaningType}
            numStories={numStories}
            numWindows={numWindows}
            setNumWindows={setNumWindows}
            additionalServices={additionalServices}
            setAdditionalServices={setAdditionalServices}
            nextStep={nextStep}
            styles={formStyles}
          />
        );

      case 4: // Energy usage or additional services
        return (
          <StepFour
            cleaningType={cleaningType}
            numWindows={numWindows}
            setNumWindows={setNumWindows}
            additionalServices={additionalServices}
            handleServiceChange={handleServiceChange}
            handleServiceCountChange={handleServiceCountChange}
            nextStep={nextStep}
            styles={formStyles}
          />
        );

      case 5: // Personal Details
        return (
          <StepFive
            personalDetails={personalDetails}
            handlePersonalDetailChange={handlePersonalDetailChange}
            handleBookingConfirm={handleBookingConfirm}
            loading={loading}
            error={error}
            styles={formStyles}
          />
        );

      default:
        return <div className="text-center text-red-500">Error: Unknown step.</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with shine effect */}
      <div className="bg-[#1A3353] text-white p-4 text-center rounded-t-[20px] bg-shine"> 
        <h2 className="text-xl font-bold relative inline-block">
          Offerte in 30 seconden
        </h2>
      </div>

      {/* Progress Bar - Now below the header */}
      <div className="w-full bg-gray-200 h-2 mb-2"> 
         <div 
           className="bg-[#FFB366] h-full transition-all duration-300 ease-in-out"
           style={{ width: `${step > 0 ? ((step -1) / (totalSteps -1)) * 100 : 0}%` }}
         ></div>
      </div>
      
      {/* Container for Steps */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto rounded-b-[20px] shadow-md">
        {/* Render current step and navigation */}
        <>
          {renderStep()}
          <StepNavigation step={step} prevStep={prevStep} />
        </>
      </div>
    </div>
  );
};

export default React.memo(SolarCalculator);