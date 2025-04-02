import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Promotional Banner - Full Width */}
      <div className="bg-[#034C80] w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="text-center text-sm font-medium text-white">
            <span className="text-pulse">LENTEPROMO: 150 EUR korting op elke offerte tot 21/04</span>
          </div>
        </div>
      </div>

      {/* Main Header - Full Width */}
      <div className="bg-white border-b border-gray-200 mb-20">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-6" />
            </div>
            
            <div className="flex items-center gap-x-2 sm:gap-x-4">
              {/* Hide "CALL US" text on mobile */}
              <span className="text-gray-700 hidden sm:inline">BEL ONS</span>
              <a 
                href="tel:015 65 88 42" 
                className="bg-[#FFB366] text-black px-3 sm:px-6 py-2 rounded-full font-medium hover:bg-[#FFA64D] transition-colors text-sm sm:text-base"
              >
                015 65 88 42
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;