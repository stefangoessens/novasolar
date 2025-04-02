import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

const ThankYouPage = () => {
  // Fire conversion tracking event when the thank you page loads
  useEffect(() => {
    // Check if gtag is available
    if (window.gtag) {
      // Track the conversion
      window.gtag('event', 'conversion', {
        'send_to': 'AW-607343181/MZI2CMrN7OgBEOHl2aAC',  // Conversion ID
        'value': 1.0,
        'currency': 'EUR',
        'transaction_id': Date.now().toString()
      });
      console.log('Conversion tracking event fired');
    }
  }, []);
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
                <span className="text-sm font-medium bg-white/10 px-4 py-2 rounded-full">BEDANKT VOOR UW OFFERTE AANVRAAG</span>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Uw groene energiereis begint hier
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                Bedankt voor uw offerte aanvraag. Een van onze experts neemt binnen 24 uur contact met u op.
                </p>
                <div>
                  <a href="tel:015 65 88 42" className="inline-flex items-center px-6 py-3 bg-[#FFB366] text-black rounded-full font-medium hover:bg-[#FFA64D] transition-colors" aria-label="Bel ons voor vragen">
                    <span aria-hidden="true">015 65 88 42</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right section - Thank you message */}
          <div className="w-full md:w-[30%] bg-white rounded-[20px] overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Header with shine effect */}
              <div className="bg-[#1A3353] text-white p-4 text-center rounded-t-[20px] bg-shine"> 
                <h2 className="text-xl font-bold relative inline-block">
                  Bedankt!
                </h2>
              </div>
              
              {/* Container for Thank You Message */}
              <div className="flex-1 p-6 space-y-4 overflow-y-auto rounded-b-[20px] shadow-md">
                <div className="text-center p-6">
                  <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-2xl font-semibold text-gray-900">Offerte Aanvraag Ontvangen!</h3>
                  <p className="mt-4 text-gray-600">
                    Uw aanvraag is succesvol ontvangen. Een van onze adviseurs neemt binnen 24 uur contact met u op om uw wensen te bespreken.
                  </p>
                  <p className="mt-4 text-gray-600">
                    Wij komen graag kosteloos bij u langs voor een exacte inmeting en prijsopgave.
                  </p>
                  <a 
                    href="/" 
                    className="mt-8 inline-block py-3 px-6 bg-[#FFB366] text-gray-900 font-semibold rounded-lg hover:bg-[#f8a650] transition-colors"
                  >
                    Terug naar home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What happens next section */}
        <div className="py-16">
          <div className="mx-4 md:mx-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Wat gebeurt er nu?
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Hier zijn de volgende stappen in het proces
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#1A3353] rounded-full flex items-center justify-center text-white font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Contact</h3>
                <p className="text-gray-600">
                  Een van onze adviseurs neemt binnen 24 uur telefonisch contact met u op om uw wensen te bespreken.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#1A3353] rounded-full flex items-center justify-center text-white font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Huisbezoek</h3>
                <p className="text-gray-600">
                  We plannen een huisbezoek in om uw dak en elektrische installatie te inspecteren en een exacte offerte op te maken.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#1A3353] rounded-full flex items-center justify-center text-white font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Installatie</h3>
                <p className="text-gray-600">
                  Na goedkeuring van de offerte plannen we de installatie, die meestal binnen 2-4 weken kan plaatsvinden.
                </p>
              </div>
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
      </div>

      {/* Use Footer component */}
      <Footer />
    </div>
  );
};

export default ThankYouPage;