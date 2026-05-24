import { useState, useEffect } from "react";

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      const screenWidth = window.innerWidth;
      
      // Check user agent safely
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
      
      // Use modern userAgentData API if available (Chrome/Edge on Android)
      // @ts-ignore
      const isMobileDevice = navigator.userAgentData?.mobile;
      
      // Fallback user agent checks
      const isAndroid = userAgent.includes('android');
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isMobileUA = /mobile/.test(userAgent);
      
      // Check for touch capability (good indicator for mobile/tablet)
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Logic for mobile (phones) vs tablet
      // iPads are usually > 768px wide. Most modern phones in portrait are <= 500px wide, but can be up to 430px.
      // Landscape phones might be up to 932px wide.
      
      let definitelyMobile = false;
      let definitelyTablet = false;

      if (isMobileDevice === true) {
        // The browser explicitly tells us it's a mobile device
        definitelyMobile = true;
      } else if (isIOS) {
        if (userAgent.includes('ipad') || (hasTouch && screenWidth >= 768)) {
          definitelyTablet = true;
        } else {
          definitelyMobile = true;
        }
      } else if (isAndroid) {
        if (isMobileUA) {
          definitelyMobile = true;
        } else {
          // Android without 'mobile' in UA is typically a tablet
          definitelyTablet = true;
        }
      } else if (hasTouch && screenWidth <= 768) {
        // Fallback for unknown touch devices
        definitelyMobile = true;
      } else if (hasTouch && screenWidth > 768 && screenWidth <= 1366) {
        definitelyTablet = true;
      }

      // If screen is extremely narrow, always force mobile layout regardless of UA
      if (screenWidth <= 600) {
        definitelyMobile = true;
        definitelyTablet = false;
      }

      setIsMobile(definitelyMobile);
      setIsTablet(definitelyTablet);
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
