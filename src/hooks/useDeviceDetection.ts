import { useState, useEffect } from "react";

// Define mobile screen width threshold (typically 768px or less for mobile)
const MOBILE_WIDTH_THRESHOLD = 768;

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      const screenWidth = window.innerWidth;
      
      // Determine if it's a mobile or tablet based on width
      const isSmallScreen = screenWidth <= MOBILE_WIDTH_THRESHOLD;
      const isTabletScreen = screenWidth > MOBILE_WIDTH_THRESHOLD && screenWidth <= 1024;
      
      // Also check user agent for mobile/tablet to be more robust
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
      const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTabletUA = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

      // Combine both checks
      const isDefinitelyTablet = isTabletScreen || isTabletUA;
      const isDefinitelyMobile = (isSmallScreen || isMobileUA) && !isDefinitelyTablet;

      setIsMobile(isDefinitelyMobile);
      setIsTablet(isDefinitelyTablet);
    };

    // Run check initially
    checkDevice();

    // Add resize listener
    window.addEventListener("resize", checkDevice);

    // Cleanup listener
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return { isMobile, isTablet };
};
