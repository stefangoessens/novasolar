import React from 'react';

// Step 4: Energy Consumption or Additional Services
const StepFour = ({ 
  cleaningType, 
  numWindows,
  setNumWindows, 
  additionalServices,
  handleServiceChange,
  handleServiceCountChange,
  nextStep, 
  styles 
}) => {
  const { 
    titleClass, 
    descriptionClass, 
    unifiedButtonBase, 
    unifiedButtonSelected, 
    unifiedButtonUnselected, 
    unifiedButtonMainText, 
    unifiedButtonSubText 
  } = styles;

  // WindowCounter sub-component - needed for Additional Services
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
            <span className={unifiedButtonSubText}>Groot verbruik (laadpaal, warmtepomp, zwembad..)</span>
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
            <span className={unifiedButtonSubText}>Groot verbruik (laadpaal, warmtepomp, zwembad..)</span>
          </button>
        </div>
      </div>
    );
  } 
  
  // For EV charger - skip consumption step
  else if (cleaningType === 'laadpaal') {
    // Set a default value and advance to next step
    setNumWindows(35);
    nextStep();
    // Return null since this step will be skipped
    return null;
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
};

export default React.memo(StepFour);