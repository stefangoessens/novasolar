import React from 'react';

// Step 5: Personal Details (Final step)
const StepFive = ({ 
  personalDetails, 
  handlePersonalDetailChange, 
  handleBookingConfirm, 
  loading, 
  error, 
  styles 
}) => {
  const { titleClass, descriptionClass } = styles;
  
  return (
    <div className="space-y-3">
      <h3 className={titleClass}>5. Uw Gegevens</h3>
      <p className={descriptionClass}>Nodig om uw offerte aan te vragen.</p>
      
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Volledige Naam" 
          value={personalDetails.name} 
          onChange={e => handlePersonalDetailChange('name', e.target.value)} 
          className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" 
        />
        <input 
          type="tel" 
          placeholder="Telefoonnummer" 
          value={personalDetails.phone} 
          onChange={e => handlePersonalDetailChange('phone', e.target.value)} 
          className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" 
        />
        <input 
          type="email" 
          placeholder="E-mailadres" 
          value={personalDetails.email} 
          onChange={e => handlePersonalDetailChange('email', e.target.value)} 
          className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" 
        />
        <input 
          type="text" 
          placeholder="Adres" 
          value={personalDetails.address} 
          onChange={e => handlePersonalDetailChange('address', e.target.value)} 
          className="w-full text-sm border border-gray-300 rounded-md p-2 focus:ring-1 focus:ring-[#FFB366]" 
        />
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
};

export default React.memo(StepFive);