import React, { useState, useEffect, useRef } from 'react';
import { saveBooking, getPipedriveStages, getPipedrivePipelines } from '../services/bookingService';
import Header from './Header';
import Footer from './Footer'; 

// Lazy-loaded video component with optimization
const LazyVideo = ({ src, ariaLabel, className }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && videoRef.current) {
            // Load the video when it comes into view
            videoRef.current.src = src;
            videoRef.current.load();
            // Disconnect after loading
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const node = containerRef.current; // Store ref value
    if (node) {
      observer.observe(node);
    }
    
    return () => {
      if (node) { // Use stored value in cleanup
        observer.unobserve(node);
      }
      observer.disconnect();
    };
  }, [src]);
  
  return (
    <div ref={containerRef} className={className || "absolute inset-0"}>
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
        aria-label={ariaLabel}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

// Simplified helper function to store form data
const prepareFormData = (data) => {
  return {
    serviceType: data.cleaningType,
    roofType: data.numStories,
    yearlyConsumption: data.numWindows * 100, // Converting slider value to kWh
    additionalOptions: data.additionalServices,
    personalDetails: data.personalDetails
  };
};

const LandingPage = () => {
  // --- REMOVED State for Pricing Settings --- 
  // const [pricingSettings, setPricingSettings] = useState(null); 
  // const [settingsLoading, setSettingsLoading] = useState(true);
  // const [settingsError, setSettingsError] = useState('');
  
  // Refs for scrolling
  const calculatorRef = useRef(null);
  const [showStickyButton, setShowStickyButton] = useState(false);
  
  // Simplified States for Solar Calculator
  const [numStories, setNumStories] = useState(null);
  const [cleaningType, setCleaningType] = useState(null);
  const [numWindows, setNumWindows] = useState(25); // Used for energy consumption/system size
  const [additionalServices, setAdditionalServices] = useState({});
  const [step, setStep] = useState(1);
  const totalSteps = 5; // Simplified to 5 steps
  const [personalDetails, setPersonalDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // eslint-disable-next-line no-unused-vars
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

  // Scroll tracking effect for sticky button
  useEffect(() => {
    const handleScroll = () => {
      if (!calculatorRef.current) return;
      
      const calculatorBottom = calculatorRef.current.getBoundingClientRect().bottom;
      // Show button when calculator is scrolled out of view
      setShowStickyButton(calculatorBottom < 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll to calculator when sticky button is clicked
  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // We've removed the quote calculation functionality
  // No need for these effects anymore

  // Simplified utility functions - removed date/time and currency formatting

  // Updated Handlers
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
  // Removed date and time slot handlers as they're no longer needed
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
      
      // For debugging: fetch available pipelines and stages so we can see what's valid
      try {
        console.log('Checking available Pipedrive pipelines for debugging...');
        await getPipedrivePipelines();
        console.log('Checking available Pipedrive stages for debugging...');
        await getPipedriveStages();
      } catch (debugErr) {
        console.log('Note: Failed to get debugging info, but continuing with submission', debugErr);
      }
      
      const result = await saveBooking(formData);
      console.log('Submission successful! Result:', result);
      
      // Set success state before resetting form
      setSuccess(true);
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
  const resetForm = () => {
    setNumStories(null);
    setCleaningType(null);
    setNumWindows(25);
    setAdditionalServices({});
    setPersonalDetails({ name: '', phone: '', email: '', address: '' });
    setStep(1);
    setError('');
    setSuccess(false);
  };
  
  // Copied WindowCounter component (needed for Additional Services step)
  const WindowCounter = ({ service, count }) => {
    // Get the appropriate unit name based on service type
    const unitName = service === 'Window Tracks' ? 'tracks' : 
                     service === 'Window Screens' ? 'screens' : 
                     service === 'Window Frames' ? 'frames' : 'windows';
    
    return (
      <div className="flex items-center mt-2">
        <span className="text-sm text-gray-700 mr-3">Number of {unitName}:</span>
        <div className="flex rounded-lg border border-gray-200">
          <button 
            onClick={() => handleServiceCountChange(service, count - 1)}
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-l-lg border-e border-gray-200 bg-gray-50 text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={count <= 1}
          >
            -
          </button>
          <input
            type="number"
            value={count}
            onChange={(e) => handleServiceCountChange(service, parseInt(e.target.value) || 1)}
            className="p-0 w-12 bg-transparent border-0 text-center text-gray-900 focus:ring-0"
            min="1"
            max={numWindows}
          />
          <button 
            onClick={() => handleServiceCountChange(service, count + 1)}
            className="w-8 h-8 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-r-lg border-s border-gray-200 bg-gray-50 text-gray-800 shadow-sm hover:bg-gray-100 disabled:opacity-50"
            disabled={count >= numWindows}
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-500 ml-2">max: {numWindows}</span>
      </div>
    );
  };

  // Copied renderStep function
  const renderStep = () => {
    // No longer need currentPricing variable based on state
    // Use constants directly where needed
    // --- Unified Button Styles for Step 1 & 2 ---
    const unifiedButtonBase = "w-full p-4 rounded-[60px] transition-all duration-200 text-center text-sm transform"; 
    const unifiedButtonSelected = "bg-[#FFB366] shadow-md hover:scale-[1.02]"; // Main orange + shadow + subtle scale on hover
    const unifiedButtonUnselected = "bg-[#FFB366] hover:bg-[#f8a650] hover:scale-[1.04]"; 
    const unifiedButtonMainText = "font-semibold text-gray-900 block text-base";
    const unifiedButtonSubText = "text-xs text-[#4c2e10] block mt-1";
    // --- Other style variables ---
    const titleClass = "text-lg font-semibold text-gray-900 text-center mb-1";
    const descriptionClass = "text-xs text-gray-800 text-center mb-3";

    switch (step) {
      case 1: // Cleaning Type Selection
        return (
          <div className="space-y-3">
            <h3 className={titleClass}>1. Naar wat bent u op zoek?</h3>
            <p className={descriptionClass}>Selecteer het type installatie dat u zoekt.</p>
            <div className="space-y-3">
              {/* Combi Package Button */}
              <button
                onClick={() => { setCleaningType('zonnepanelen-batterij'); nextStep(); }}
                className={`${unifiedButtonBase} ${cleaningType === 'zonnepanelen-batterij' ? unifiedButtonSelected : unifiedButtonUnselected} btn-shine`}
              >
                 <span className={unifiedButtonMainText}>Zonnepanelen & Batterijopslag</span>
                 <span className={unifiedButtonSubText}>Complete oplossing voor energiebesparing</span>
              </button>
              {/* Solar Panels Button */}
              <button
                onClick={() => { setCleaningType('zonnepanelen'); nextStep(); }}
                className={`${unifiedButtonBase} ${cleaningType === 'zonnepanelen' ? unifiedButtonSelected : unifiedButtonUnselected} btn-shine`}
              >
                <span className={unifiedButtonMainText}>Zonnepanelen</span>
                <span className={unifiedButtonSubText}>Complete installatie van zonnepanelen</span>
              </button>
              {/* Battery Storage Button */}
              <button
                onClick={() => { setCleaningType('batterijopslag'); nextStep(); }}
                className={`${unifiedButtonBase} ${cleaningType === 'batterijopslag' ? unifiedButtonSelected : unifiedButtonUnselected} btn-shine`}
              >
                <span className={unifiedButtonMainText}>Batterijopslag</span>
                <span className={unifiedButtonSubText}>Opslag van uw zelf opgewekte energie</span>
              </button>
              {/* EV Charger Button */}
              <button
                onClick={() => { setCleaningType('laadpaal'); nextStep(); }}
                className={`${unifiedButtonBase} ${cleaningType === 'laadpaal' ? unifiedButtonSelected : unifiedButtonUnselected} btn-shine`}
              >
                 <span className={unifiedButtonMainText}>Laadpaal</span>
                 <span className={unifiedButtonSubText}>Elektrische auto thuis opladen</span>
              </button>
            </div>
          </div>
        );

      case 2: // Conditional second step based on first selection
        // Show different questions based on user's first selection
        if (cleaningType === 'zonnepanelen' || cleaningType === 'zonnepanelen-batterij') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>2. Wat voor type dak heeft u?</h3>
              <p className={descriptionClass}>Het type dak beïnvloedt de installatiemethode.</p>
              <div className="space-y-3">
                <button onClick={() => { setNumStories(1); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Hellend dak</span>
                  <span className={unifiedButtonSubText}>Schuin dak met dakpannen</span>
                </button>
                <button onClick={() => { setNumStories(2); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 2 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Plat dak</span>
                  <span className={unifiedButtonSubText}>Vlakke dakbedekking</span>
                </button>
              </div>
            </div>
          );
        } else if (cleaningType === 'batterijopslag') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>2. Heeft u reeds een hybride omvormer?</h3>
              <p className={descriptionClass}>Een hybride omvormer is nodig voor een thuisbatterij.</p>
              <div className="space-y-3">
                <button onClick={() => { setNumStories(1); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Ja</span>
                  <span className={unifiedButtonSubText}>Ik heb al een hybride omvormer</span>
                </button>
                <button onClick={() => { setNumStories(2); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 2 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Nee</span>
                  <span className={unifiedButtonSubText}>Ik heb nog geen hybride omvormer</span>
                </button>
              </div>
            </div>
          );
        } else if (cleaningType === 'laadpaal') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>2. Heeft u een 1 of 3-fasen aansluiting?</h3>
              <p className={descriptionClass}>Dit bepaalt het type laadpaal dat geschikt is voor uw woning.</p>
              <div className="space-y-3">
                <button onClick={() => { setNumStories(1); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>1-fase</span>
                  <span className={unifiedButtonSubText}>Standaard huisaansluiting</span>
                </button>
                <button onClick={() => { setNumStories(2); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 2 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>3-fase</span>
                  <span className={unifiedButtonSubText}>Krachtstroom aansluiting</span>
                </button>
                <button onClick={() => { setNumStories(3); nextStep(); }}
                        className={`${unifiedButtonBase} ${numStories === 3 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Ik weet het niet</span>
                  <span className={unifiedButtonSubText}>We helpen u dit te bepalen</span>
                </button>
              </div>
            </div>
          );
        }
        
        // Default fallback
        return (
          <div className="space-y-3">
            <h3 className={titleClass}>2. Wat voor type dak heeft u?</h3>
            <p className={descriptionClass}>Het type dak beïnvloedt de installatiemethode.</p>
            <div className="space-y-3">
              <button onClick={() => { setNumStories(1); nextStep(); }}
                      className={`${unifiedButtonBase} ${numStories === 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                <span className={unifiedButtonMainText}>Hellend dak</span>
                <span className={unifiedButtonSubText}>Schuin dak met dakpannen</span>
              </button>
              <button onClick={() => { setNumStories(2); nextStep(); }}
                      className={`${unifiedButtonBase} ${numStories === 2 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                <span className={unifiedButtonMainText}>Plat dak</span>
                <span className={unifiedButtonSubText}>Vlakke dakbedekking</span>
              </button>
            </div>
          </div>
        );

      case 3: // Step 3 - House age
        // For solar panels or solar panels + battery
        if (cleaningType === 'zonnepanelen' || cleaningType === 'zonnepanelen-batterij') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>3. Hoe oud is uw woning?</h3>
              <p className={descriptionClass}>Dit helpt ons bij het inschatten van uw elektrische installatie.</p>
              <div className="space-y-3">
                <button onClick={() => { 
                  // We store the choice in additionalServices for simplicity
                  const newAdditionalServices = {...additionalServices};
                  newAdditionalServices['house_age'] = 'old';
                  setAdditionalServices(newAdditionalServices);
                  nextStep(); 
                }}
                className={`${unifiedButtonBase} ${additionalServices['house_age'] === 'old' ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Ouder dan 10 jaar</span>
                  <span className={unifiedButtonSubText}>Gebouwd vóór 2014</span>
                </button>
                <button onClick={() => { 
                  const newAdditionalServices = {...additionalServices};
                  newAdditionalServices['house_age'] = 'new';
                  setAdditionalServices(newAdditionalServices);
                  nextStep(); 
                }}
                className={`${unifiedButtonBase} ${additionalServices['house_age'] === 'new' ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Jonger dan 10 jaar</span>
                  <span className={unifiedButtonSubText}>Gebouwd na 2014</span>
                </button>
              </div>
            </div>
          );
        }
        // For battery storage
        else if (cleaningType === 'batterijopslag') {
          // If step 2 selected "Yes" for hybrid inverter
          if (numStories === 1) {
            return (
              <div className="space-y-3">
                <h3 className={titleClass}>3. Welke merk omvormer heeft u?</h3>
                <p className={descriptionClass}>Dit bepaalt welke thuisbatterij compatibel is met uw installatie.</p>
                <div className="space-y-3">
                  {["SMA", "Fronius", "Huawei", "Goodwe", "SolarEdge", "Ik weet het niet"].map((brand) => (
                    <button 
                      key={brand}
                      onClick={() => { 
                        // We're using the numWindows state to store the brand choice
                        // This is a bit of a hack but works for this demo
                        setNumWindows(["SMA", "Fronius", "Huawei", "Goodwe", "SolarEdge", "Ik weet het niet"].indexOf(brand) + 1);
                        nextStep();
                      }}
                      className={`${unifiedButtonBase} ${numWindows === ["SMA", "Fronius", "Huawei", "Goodwe", "SolarEdge", "Ik weet het niet"].indexOf(brand) + 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}
                    >
                      <span className={unifiedButtonMainText}>{brand}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          } 
          // If they selected "No" for hybrid inverter
          else {
            return (
              <div className="space-y-3">
                <h3 className={titleClass}>3. Wat is uw jaarlijks verbruik?</h3>
                <div className="text-center mb-2">
                  <span className="text-xl font-bold text-gray-800">{numWindows * 100} kWh</span>
                </div>
                <div>
                  <style>
                    {`
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
                        border: 2px solid white;
                        cursor: pointer;
                      }

                      .custom-slider::-moz-range-thumb {
                        width: 24px;
                        height: 24px;
                        background: #FFB366;
                        border-radius: 50%;
                        border: 2px solid white;
                        cursor: pointer;
                      }
                    `}
                  </style>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={numWindows}
                    onChange={(e) => setNumWindows(parseInt(e.target.value))}
                    className="custom-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>2.000 kWh</span>
                    <span>10.000 kWh</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Een gemiddeld huishouden van {Math.ceil(numWindows * 100 / 3500)} personen verbruikt ongeveer {numWindows * 100} kWh per jaar.
                  </p>
                </div>
              </div>
            );
          }
        }
        // For charging station
        else if (cleaningType === 'laadpaal') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>3. Heeft u reeds zonnepanelen of een thuisbatterij?</h3>
              <p className={descriptionClass}>Dit helpt bij het bepalen van de optimale laadoplossing.</p>
              <div className="space-y-3">
                <button onClick={() => { setNumWindows(1); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Zonnepanelen</span>
                  <span className={unifiedButtonSubText}>Ik heb al zonnepanelen</span>
                </button>
                <button onClick={() => { setNumWindows(2); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 2 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Thuisbatterij</span>
                  <span className={unifiedButtonSubText}>Ik heb een thuisbatterij</span>
                </button>
                <button onClick={() => { setNumWindows(3); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 3 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Beide</span>
                  <span className={unifiedButtonSubText}>Ik heb zonnepanelen en een thuisbatterij</span>
                </button>
                <button onClick={() => { setNumWindows(4); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 4 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>Geen van beide</span>
                  <span className={unifiedButtonSubText}>Ik heb geen zonnepanelen of thuisbatterij</span>
                </button>
              </div>
            </div>
          );
        }
        
        // Default fallback - original power capacity slider
        return (
          <div className="space-y-3">
            <h3 className={titleClass}>3. Hoeveel Vermogen Heeft U Nodig?</h3>
            <div className="text-center mb-2">
              <span className="text-xl font-bold text-gray-800">{numWindows} kWp</span>
            </div>
            <div>
              <style>
                {`
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
                    border: 2px solid white;
                    cursor: pointer;
                  }

                  .custom-slider::-moz-range-thumb {
                    width: 24px;
                    height: 24px;
                    background: #FFB366;
                    border-radius: 50%;
                    border: 2px solid white;
                    cursor: pointer;
                  }
                `}
              </style>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={numWindows}
                onChange={(e) => setNumWindows(parseInt(e.target.value))}
                className="custom-slider"
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                {numWindows} kWp kan ongeveer {Math.round(numWindows * 850)} kWh per jaar opleveren en is geschikt voor een gemiddeld huishouden van {Math.ceil(numWindows/3)} personen.
              </p>
            </div>
          </div>
        );

      case 4: // Step 4 - Energy consumption
        // For solar panels or solar panels + battery
        if (cleaningType === 'zonnepanelen' || cleaningType === 'zonnepanelen-batterij') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>4. Wat is uw jaarlijks verbruik?</h3>
              <p className={descriptionClass}>Selecteer uw gemiddeld jaarlijks energieverbruik.</p>
              <div className="space-y-3">
                <button onClick={() => { setNumWindows(25); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 25 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>2000-3000 kWh</span>
                  <span className={unifiedButtonSubText}>Klein huishouden (1-2 personen)</span>
                </button>
                <button onClick={() => { setNumWindows(35); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 35 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>3000-4000 kWh</span>
                  <span className={unifiedButtonSubText}>Gemiddeld huishouden (2-3 personen)</span>
                </button>
                <button onClick={() => { setNumWindows(50); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 50 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>4000-6000 kWh</span>
                  <span className={unifiedButtonSubText}>Groot huishouden (3-4 personen)</span>
                </button>
                <button onClick={() => { setNumWindows(70); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 70 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>6000 kWh of meer</span>
                  <span className={unifiedButtonSubText}>Zeer groot huishouden (5+ personen)</span>
                </button>
              </div>
            </div>
          );
        }
        // For battery storage
        else if (cleaningType === 'batterijopslag') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>4. Wat is uw jaarlijks verbruik?</h3>
              <p className={descriptionClass}>Selecteer uw gemiddeld jaarlijks energieverbruik.</p>
              <div className="space-y-3">
                <button onClick={() => { setNumWindows(25); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 25 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>2000-3000 kWh</span>
                  <span className={unifiedButtonSubText}>Klein huishouden (1-2 personen)</span>
                </button>
                <button onClick={() => { setNumWindows(35); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 35 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>3000-4000 kWh</span>
                  <span className={unifiedButtonSubText}>Gemiddeld huishouden (2-3 personen)</span>
                </button>
                <button onClick={() => { setNumWindows(50); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 50 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>4000-6000 kWh</span>
                  <span className={unifiedButtonSubText}>Groot huishouden (3-4 personen)</span>
                </button>
                <button onClick={() => { setNumWindows(70); nextStep(); }}
                        className={`${unifiedButtonBase} ${numWindows === 70 ? unifiedButtonSelected : unifiedButtonUnselected}`}>
                  <span className={unifiedButtonMainText}>6000 kWh of meer</span>
                  <span className={unifiedButtonSubText}>Zeer groot huishouden (5+ personen)</span>
                </button>
              </div>
            </div>
          );
        } 
        // For EV charger
        else if (cleaningType === 'laadpaal') {
          return (
            <div className="space-y-3">
              <h3 className={titleClass}>4. We kunnen u een offerte maken</h3>
              <p className={descriptionClass}>Op basis van uw antwoorden kunnen we een passende oplossing samenstellen.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-center">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Vraag nu uw gratis offerte aan</h4>
                <p className="text-sm text-gray-600 mb-4">
                  We nemen binnen 24 uur contact met u op om de mogelijkheden te bespreken.
                </p>
                <button 
                  onClick={nextStep} 
                  className="bg-[#FFB366] text-gray-900 px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#FFA64D] transition-colors"
                >
                  Offerte aanvragen
                </button>
              </div>
            </div>
          );
        }
        // Default additional services
        return (
          <div className="space-y-3">
            <h3 className={titleClass}>4. Heeft u interesse in:</h3>
            <p className={descriptionClass}>Selecteer optionele toevoegingen voor uw installatie.</p>
            <div className="space-y-3">
              {Object.entries({
                'EMS Systeem (Slimme sturing)': { selected: additionalServices['Window Tracks']?.selected || false, price: 850 },
                'Laadpaal': { selected: additionalServices['Window Screens']?.selected || false, price: 1350 },
                'Back-up voorziening': { selected: additionalServices['Window Frames']?.selected || false, price: 750 },
                'Airco / warmtepomp': { selected: false, price: 1500 }
              }).map(([service, details]) => (
                <div key={service} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={details.selected} onChange={() => handleServiceChange(service)} className="sr-only peer"/>
                      <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FFB366]"></div>
                    </label>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{service}</h4>
                      <p className="text-[10px] text-gray-500">
                        +€{typeof details.price === 'number' ? details.price.toFixed(2) : details.price}
                      </p>
                    </div>
                  </div>
                  {details.selected && (
                    <div className="mt-3 ml-11">
                      <WindowCounter service={service} count={details.count} /> 
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 5: // Final Step - Personal Details
        return (
          <div className="space-y-3">
            <h3 className={titleClass}>5. Uw Gegevens</h3>
            <p className={descriptionClass}>Nodig om uw offerte aan te vragen.</p>
            
            <div className="space-y-3">
              <input type="text" placeholder="Volledige Naam" value={personalDetails.name} onChange={e => handlePersonalDetailChange('name', e.target.value)} className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" />
              <input type="tel" placeholder="Telefoonnummer" value={personalDetails.phone} onChange={e => handlePersonalDetailChange('phone', e.target.value)} className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" />
              <input type="email" placeholder="E-mailadres" value={personalDetails.email} onChange={e => handlePersonalDetailChange('email', e.target.value)} className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" />
              <input type="text" placeholder="Adres" value={personalDetails.address} onChange={e => handlePersonalDetailChange('address', e.target.value)} className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" />
            </div>

            {error && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                <p>{error}</p>
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-3">Onze specialist komt kosteloos bij u langs voor een exacte inmeting en prijsopgave.</p>
              <button
                onClick={handleBookingConfirm}
                type="button"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-base font-semibold rounded-lg border border-transparent bg-[#FFB366] text-gray-900 hover:bg-[#f8a650] disabled:opacity-50 disabled:pointer-events-none"
                disabled={loading || !personalDetails.name || !personalDetails.phone || !personalDetails.email || !personalDetails.address}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verwerken...
                  </>
                ) : 'Offerte Aanvragen'}
              </button>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-red-500">Error: Unknown step.</div>;
    }
  };

  // Simplified StepNavigation component
  const StepNavigation = () => (
    <div className="mt-4 flex justify-between">
      {step > 1 && step < 5 && (
        <button 
          onClick={prevStep} 
          className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Terug
        </button>
      )}
    </div>
  );

  // --- Main Return JSX --- 
  return (
    <div className="min-h-screen bg-[#FAF3E7]">
      <Header />
      <div className="pt-28 bg-[#FAF3E7]">
        <div className="mx-4 md:mx-8 flex flex-col md:flex-row md:h-[600px] gap-4 md:gap-5">
          {/* Left section */}
          <div className="w-full md:w-[70%] relative rounded-[20px] overflow-hidden min-h-[400px] md:min-h-0">
            {/* Video background */}
            <div className="absolute inset-0">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="auto"
                loading="eager"
                poster={`${process.env.PUBLIC_URL}/hero-poster.jpg`}
                className="absolute inset-0 w-full h-full object-cover" 
                aria-label="Professional window cleaning service in action"
              >
                <source src={`${process.env.PUBLIC_URL}/loop.webm`} type="video/webm" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/30" />
            </div>
            {/* Content overlay */}
            <div className="relative h-full flex flex-col justify-center p-6 md:px-12 text-white">
              <div className="space-y-4 md:space-y-6">
                <span className="text-sm font-medium bg-white/10 px-4 py-2 rounded-full">VRAAG JOUW OFFERTE AAN</span>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                De alles-in-één oplossing voor groene energie
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                Maak uw woning slimmer, groener en efficiënter met onze energie oplossingen.
                Ontvang een persoonlijke offerte en begin vandaag nog met besparen!
                </p>
                <div>
                  <a href="tel:015 65 88 42" className="inline-flex items-center px-6 py-3 bg-[#FFB366] text-black rounded-full font-medium hover:bg-[#FFA64D] transition-colors" aria-label="Bel ons voor een vrijblijvende offerte">
                    <span aria-hidden="true">015 65 88 42</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Calculator Steps */}
          <div ref={calculatorRef} className="w-full md:w-[30%] bg-white rounded-[20px] overflow-hidden">
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
                 {/* Conditional rendering for Success Message */}
                 {success ? (
                   <div className="text-center p-6">
                      <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                     <h3 className="mt-4 text-xl font-semibold text-gray-900">Offerte Aanvraag Ontvangen!</h3>
                     <p className="mt-2 text-gray-600">Bedankt voor uw aanvraag. Een van onze adviseurs neemt binnen 24 uur contact met u op.</p>
                     <p className="mt-2 text-gray-600">Wij komen graag kosteloos bij u langs voor een exacte inmeting en prijsopgave.</p>
                     <button onClick={resetForm} className="mt-6 py-2 px-4 bg-[#FFB366] text-gray-900 font-semibold rounded-lg hover:bg-[#f8a650]">
                       Nieuwe Aanvraag
                     </button>
                   </div>
                 ) : (
                    // Render current step and navigation
                   <>
                     {renderStep()}
                     <StepNavigation />
                   </>
                 )}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Process Section */}
        <div className="py-16">
          <div className="mx-4 md:mx-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Onze aanpak in 3 stappen
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Onze eenvoudige en transparante manier van werken
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                {/* Video background */}
                <div className="absolute inset-0">
                  <LazyVideo 
                    src={`${process.env.PUBLIC_URL}/1.webm`} 
                    ariaLabel="Step 1: Consultation"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-white mb-2">1. PERSOONLIJK ADVIES</div>
                    <p className="text-white text-base">
                      We analyseren uw energieverbruik, controleren uw dak en elektrische installatie waarna we een transparante offerte op maat afleveren.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                {/* Video background */}
                <div className="absolute inset-0">
                  <LazyVideo 
                    src={`${process.env.PUBLIC_URL}/2.webm`} 
                    ariaLabel="Step 2: Design and Planning"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-white mb-2">2. INSTALLATIE</div>
                    <p className="text-white text-base">
                      Onze ervaren techniekers zorgen ervoor dat alles professioneel is geïnstalleerd en afgewerkt, dit gebeurt meestal binnen één werkdag.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden">
                {/* Video background */}
                <div className="absolute inset-0">
                  <LazyVideo 
                    src={`${process.env.PUBLIC_URL}/3.webm`} 
                    ariaLabel="Step 3: Installation"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="text-3xl font-bold text-white mb-2">3. OPSTART</div>
                    <p className="text-white text-base">
                      U krijgt uitgebreide uitleg over het gebruik, we installeren de monitoring app en overhandigen alle garantiecertificaten.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Areas We Serve Section */}
        <div className="py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Ons Werkgebied
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Professionele zonnepanelen installatie in heel België
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                "Mechelen",
                "Antwerpen",
                "Brussel",
                "Leuven",
                "Vilvoorde",
                "Sint-Niklaas",
                "Aalst",
                "Willebroek",
                "Dendermonde",
                "Grimbergen",
                "Duffel",
                "Puurs"
              ].map((area) => (
                <div key={area} className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:bg-[#1A3353] hover:text-white transition-colors group">
                  <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#FFB366] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{area}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">Staat uw locatie er niet bij? Bel ons om te controleren of we in uw gemeente werken!</p>
              <a href="tel:015 65 88 42" className="inline-flex items-center px-6 py-3 mt-4 bg-[#FFB366] text-gray-900 rounded-full font-medium hover:bg-[#FFA64D] transition-colors">
                
                015 65 88 42
              </a>
            </div>
          </div>
        </div>

        {/* Marquee Section */}
        <div className="w-full bg-[#1A3353] py-4 overflow-hidden">
          <div className="animate-marquee-fast md:animate-marquee whitespace-nowrap">
            <span className="inline-block text-white text-xl font-semibold mx-8">
              INSTALLATIE BINNEN 2-4 WEKEN <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> <span className="text-[#59D3FF]">ZONDER VOORSCHOT, BETAAL ACHTERAF</span> <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> MEER DAN 2.500 TEVREDEN KLANTEN <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> <span className="text-[#59D3FF]">25 JAAR GARANTIE</span> <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> INSTALLATIE BINNEN 2-4 WEKEN <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> <span className="text-[#59D3FF]">ZONDER VOORSCHOT, BETAAL ACHTERAF</span> <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> MEER DAN 2.500 TEVREDEN KLANTEN <span className="inline-block w-3 h-3 mx-2 rounded-full bg-[#FFB366]"></span> <span className="text-[#59D3FF]">25 JAAR GARANTIE</span>
            </span>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="py-16 bg-[#FAF3E7]">
          <div className="mx-4 md:mx-8 max-w-7xl md:mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Wat Onze Klanten Zeggen
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Sluit u aan bij duizenden tevreden klanten die ons vertrouwen met hun energie-oplossingen
            </p>
            
            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Review 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#FFB366]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 flex-grow">
                  "Ik heb verschillende zonnepanelen leveranciers vergeleken, maar geen van hen evenaarde de kwaliteit en aandacht voor detail van NovaSolar. Hun zonnepanelen presteren boven verwachting en ze leverden alles stipt op tijd!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#1A3353] rounded-full flex items-center justify-center text-white font-bold">
                    JM
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Jan Martens</p>
                    <p className="text-sm text-gray-500">Grimbergen</p>
                  </div>
                </div>
              </div>
              
              {/* Review 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#FFB366]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 flex-grow">
                  "Het offerte proces was ongelooflijk eenvoudig en transparant. Ik kreeg direct een berekening, plande mijn installatie en het team was precies op tijd. Mijn energierekening is nu 75% lager - absoluut een slimme investering!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#1A3353] rounded-full flex items-center justify-center text-white font-bold">
                    EV
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Emma Verhoeven</p>
                    <p className="text-sm text-gray-500">Mechelen</p>
                  </div>
                </div>
              </div>
              
              {/* Review 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="flex text-[#FFB366]">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4 flex-grow">
                  "Ik koos voor het batterijopslag systeem erbij en dat was elke euro waard. De technici waren professioneel, respectvol en deden uitstekend werk. Ze legden zelfs uit hoe ik de app kon gebruiken om mijn energieverbruik te monitoren en optimaliseren."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#1A3353] rounded-full flex items-center justify-center text-white font-bold">
                    LD
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Lucas Dubois</p>
                    <p className="text-sm text-gray-500">Brasschaat</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-[#1A3353]">2.500+</div>
                <div className="text-gray-600 text-sm">Tevreden Klanten</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-[#1A3353]">4.9</div>
                <div className="flex text-[#FFB366] mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-gray-600 text-sm">Gemiddelde Beoordeling</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl font-bold text-[#1A3353]">10+</div>
                <div className="text-gray-600 text-sm">Jaar Ervaring</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Use Footer component */}
      <Footer />
      
      {/* Mobile sticky button - only shows when scrolled past calculator */}
      {showStickyButton && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden z-40 p-4 bg-[#1A3353] shadow-lg">
          <button 
            onClick={scrollToCalculator}
            className="w-full py-3 px-4 bg-[#FFB366] text-black font-bold rounded-lg shadow-md hover:bg-[#FFA64D] transition-colors flex items-center justify-center"
          >
            <span>GRATIS OFFERTE</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
    </div>
  );
};

export default LandingPage; 