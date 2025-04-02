// Default pricing constants - these will be replaced by values from the database
export const DEFAULT_PRICING = {
  BASE_RATE_PER_WINDOW: 5,
  TWO_STORY_SURCHARGE: 0.25, // 25%
  INSIDE_CLEANING_SURCHARGE_PER_WINDOW: 4,
  TRACK_CLEANING_RATE: 1.00,
  SCREEN_CLEANING_RATE: 1.50,
  HARD_WATER_RATE: 2.00,
  DEFAULT_WINDOW_PER_SQFT: 0.01, // 1 window per 100 sq ft
};

// Helper function to calculate quote
export const calculateQuote = (
  numWindows, 
  numStories, 
  cleaningType, 
  additionalServices, 
  isFirstTimeCustomer = true,
  pricing = DEFAULT_PRICING // Use passed pricing or fall back to defaults
) => {
  if (!numWindows || numWindows <= 0) {
    return { baseRate: 0, insideCleaningSurcharge: 0, twoStorySurcharge: 0, additionalServicesTotal: 0, finalQuote: 0, discount: 0 };
  }
  
  // Extract pricing values
  const {
    BASE_RATE_PER_WINDOW,
    TWO_STORY_SURCHARGE,
    INSIDE_CLEANING_SURCHARGE_PER_WINDOW,
    TRACK_CLEANING_RATE,
    SCREEN_CLEANING_RATE,
    HARD_WATER_RATE
  } = pricing;
  
  // Step 1: Calculate base rate
  const baseRate = numWindows * BASE_RATE_PER_WINDOW;
  
  // Step 2: Calculate inside cleaning surcharge if applicable
  const insideCleaningSurcharge = cleaningType === 'bothInsideOutside' ? numWindows * INSIDE_CLEANING_SURCHARGE_PER_WINDOW : 0;
  
  // Step 3: Apply two-story surcharge if applicable (based on base rate)
  const twoStorySurcharge = numStories >= 2 ? baseRate * TWO_STORY_SURCHARGE : 0;
  
  // Step 4: Calculate subtotal before additional services
  const subtotalBeforeAddons = baseRate + insideCleaningSurcharge + twoStorySurcharge;

  // Step 5: Calculate additional services
  let additionalServicesTotal = 0;
  if (additionalServices) {
    // Use the service-specific price or fall back to defaults
    const trackCleaning = additionalServices['Window Tracks']?.selected 
      ? additionalServices['Window Tracks'].count * (additionalServices['Window Tracks'].price || TRACK_CLEANING_RATE) 
      : 0;
      
    const screenCleaning = additionalServices['Window Screens']?.selected 
      ? additionalServices['Window Screens'].count * (additionalServices['Window Screens'].price || SCREEN_CLEANING_RATE) 
      : 0;
      
    const hardWaterRemoval = additionalServices['Window Frames']?.selected 
      ? additionalServices['Window Frames'].count * (additionalServices['Window Frames'].price || HARD_WATER_RATE) 
      : 0;
      
    additionalServicesTotal = trackCleaning + screenCleaning + hardWaterRemoval;
  }
  
  // Step 6: Calculate subtotal
  const subtotal = subtotalBeforeAddons + additionalServicesTotal;
  
  // Step 7: Apply discount if first-time customer
  const discount = isFirstTimeCustomer ? subtotal * 0.1 : 0;
  
  // Step 8: Calculate final quote
  const finalQuote = subtotal - discount;
  
  return {
    baseRate,
    insideCleaningSurcharge,
    twoStorySurcharge,
    additionalServicesTotal,
    subtotal,
    discount,
    finalQuote
  };
};

// Utility function to format currency
export const formatCurrency = (amount) => {
  return `$${Number(amount).toFixed(2)}`;
};

// Utility function to format date
export const formatDate = (date) => {
  if (!date) return '';
  // Handle Firestore timestamps (which have a toDate method)
  const dateObj = date.toDate ? date.toDate() : new Date(date);
  return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

// Utility function to generate next 7 days
export const getNext7Days = () => {
  const days = [];
  const today = new Date();
  
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  
  return days;
};