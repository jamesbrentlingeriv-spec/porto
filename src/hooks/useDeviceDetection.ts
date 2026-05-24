import { useState, useEffect } from "react";

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      const screenWidth = window.innerWidth;
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent.toLowerCase() : '';
      
      // Use modern userAgentData API if available
      // @ts-expect-error - navigator.userAgentData is experimental
      const isMobileDevice = navigator.userAgentData?.mobile;
      
      const isAndroid = userAgent.includes('android');
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isMobileUA = /mobile/.test(userAgent);
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      let definitelyMobile = false;
      let definitelyTablet = false;

      // 1. Explicit user agent checks
      if (isIOS) {
        if (userAgent.includes('ipad') || (hasTouch && screenWidth >= 768)) {
          definitelyTablet = true;
        } else {
          definitelyMobile = true;
        }
      } else if (isAndroid) {
        if (isMobileUA) {
          definitelyMobile = true;
        } else {
          definitelyTablet = true;
        }
      }

      // 2. Fallback checks if UA didn't give a definitive answer
      if (!definitelyMobile && !definitelyTablet) {
        if (isMobileDevice === true) {
          definitelyMobile = true;
        } else if (hasTouch) {
          if (screenWidth <= 768) {
            definitelyMobile = true;
          } else if (screenWidth > 768 && screenWidth <= 1366) {
            definitelyTablet = true;
          }
        }
      }

      // 3. Absolute screen width overrides (safety net)
      if (screenWidth <= 600) {
        definitelyMobile = true;
        definitelyTablet = false;
      }

      setIsMobile(definitelyMobile);
      setIsTablet(definitelyTablet);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  return { isMobile, isTablet };
};
