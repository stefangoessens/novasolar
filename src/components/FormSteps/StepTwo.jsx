import React from 'react';

// Step 2: Configuration component (different based on service type)
const StepTwo = ({ cleaningType, numStories, setNumStories, nextStep, styles }) => {
  const { 
    titleClass, 
    descriptionClass, 
    unifiedButtonBase, 
    unifiedButtonSelected, 
    unifiedButtonUnselected, 
    unifiedButtonMainText, 
    unifiedButtonSubText 
  } = styles;

  // Show different question based on service type
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
};

export default React.memo(StepTwo);