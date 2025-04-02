import React from 'react';

// Step 1: Service Type Selection component
const StepOne = ({ cleaningType, setCleaningType, nextStep, styles }) => {
  const { 
    titleClass, 
    descriptionClass, 
    unifiedButtonBase, 
    unifiedButtonSelected, 
    unifiedButtonUnselected, 
    unifiedButtonMainText, 
    unifiedButtonSubText 
  } = styles;

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
};

export default React.memo(StepOne);