import { useState, useEffect } from "react";

// Define mobile screen width threshold (typically 768px or less for mobile)
const MOBILE_WIDTH_THRESHOLD = 768;
// Define approximate screen dimensions for common mobile devices
const MOBILE_SCREEN_RATIOS = [
  { width: 375, height: 667 }, // iPhone SE, older iPhones
  { width: 414, height: 896 }, // iPhone XR, 11
  { width: 390, height: 844 }, // iPhone 12, 13 mini
  { width: 428, height: 926 }, // iPhone 12 Pro Max
  { width: 360, height: 640 }, // Android standard
  { width: 412, height: 915 }, // Pixel 6
  { width: 393, height: 851 }, // Pixel 7
  { width: 360, height: 780 }, // Foldables
];

export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkDevice = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Check screen size first
      const isSmallScreen = screenWidth <= MOBILE_WIDTH_THRESHOLD;

      // Check if screen dimensions match known mobile ratios
      const matchesMobileRatio = MOBILE_SCREEN_RATIOS.some((ratio) => {
        // Allow some tolerance for different devices
        const widthMatch = Math.abs(ratio.width - screenWidth) <= 30;
        const heightMatch = Math.abs(ratio.height - screenHeight) <= 30;
        return widthMatch && heightMatch;
      });

      // Calculate diagonal size to differentiate tablet vs phone
      const diagonalInches =
        Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight) /
        window.devicePixelRatio /
        96;

      // Determine if it's a mobile device (not tablet)
      const isDefinitelyMobile =
        isSmallScreen && matchesMobileRatio && diagonalInches < 7;
      const isDefinitelyTablet = diagonalInches >= 7 && screenWidth <= 1024;

      setIsMobile(isDefinitelyMobile && !isDefinitelyTablet);
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
