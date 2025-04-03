import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import SolarCalculator from './SolarCalculator';
import LazyVideo from './FormSteps/LazyVideo';

const LandingPage = () => {
  // Refs for scrolling
  const calculatorRef = useRef(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

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
                aria-label="Zonnepanelen installateur in mechelen"
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
            <SolarCalculator />
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