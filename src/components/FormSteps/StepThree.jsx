import React from 'react';

// Step 3: House Age or Inverter Brand or Energy Consumption
const StepThree = ({ 
  cleaningType, 
  numStories, 
  numWindows, 
  setNumWindows, 
  additionalServices, 
  setAdditionalServices, 
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
    unifiedButtonSubText,
    sliderStyles 
  } = styles;

  // For solar panels or solar panels + battery
  if (cleaningType === 'zonnepanelen' || cleaningType === 'zonnepanelen-batterij') {
    return (
      <div className="space-y-3">
        <h3 className={titleClass}>3. Hoe oud is uw woning?</h3>
        <p className={descriptionClass}>Om het correcte BTW tarief te kunnen berekenen.</p>
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
            {["SMA", "Fronius", "Huawei", "Goodwe", "SolarEdge", "Ik weet het niet/Andere"].map((brand) => (
              <button 
                key={brand}
                onClick={() => { 
                  // We're using the numWindows state to store the brand choice
                  setNumWindows(["SMA", "Fronius", "Huawei", "Goodwe", "SolarEdge", "Ik weet het niet/Andere"].indexOf(brand) + 1);
                  nextStep();
                }}
                className={`${unifiedButtonBase} ${numWindows === ["SMA", "Fronius", "Huawei", "Goodwe", "SolarEdge", "Ik weet het niet/Andere"].indexOf(brand) + 1 ? unifiedButtonSelected : unifiedButtonUnselected}`}
              >
                <span className={unifiedButtonMainText}>{brand}</span>
              </button>
            ))}
          </div>
        </div>
      );
    } 
    // If they selected "No" for hybrid inverter - skip this step
    else {
      // Set a default value and advance to next step
      setNumWindows(35);
      nextStep();
      // Return null since this step will be skipped
      return null;
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
  
  // Default fallback - power capacity slider
  return (
    <div className="space-y-3">
      <h3 className={titleClass}>3. Hoeveel Vermogen Heeft U Nodig?</h3>
      <div className="text-center mb-2">
        <span className="text-xl font-bold text-gray-800">{numWindows} kWp</span>
      </div>
      <div>
        <style>{sliderStyles}</style>
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
};

export default React.memo(StepThree);