import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CRTEffect from './components/layout/CRTEffect';
import CustomCursor from './components/layout/CustomCursor';
import BootSequence from './components/layout/BootSequence';
import Desktop from './components/layout/Desktop';
import MobileLayout from './components/mobile/MobileLayout';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { SoundProvider } from './components/layout/SoundProvider';

function App() {
  const [booted, setBooted] = useState(false);
  const { isMobile, isTablet } = useDeviceDetection();

  // Show mobile layout only on mobile devices (not tablets)
  const showMobileLayout = isMobile && !isTablet;

  return (
    <SoundProvider>
      <CRTEffect />
      {showMobileLayout ? null : <CustomCursor />}
      <main className={`w-full h-full relative overflow-hidden bg-[#0F1729] ${showMobileLayout ? 'h-screen' : ''}`}>
        <AnimatePresence mode="wait">
          {!booted ? (
            <motion.div
              key="boot"
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <BootSequence onComplete={() => setBooted(true)} />
            </motion.div>
          ) : (
            showMobileLayout ? (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0"
              >
                <MobileLayout />
              </motion.div>
            ) : (
              <motion.div
                key="desktop"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                className="absolute inset-0"
              >
                <Desktop />
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>
    </SoundProvider>
  );
}

export default App;