import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BootSequence from './components/layout/BootSequence';
import MobileLayout from './components/mobile/MobileLayout';
import { SoundProvider } from './components/layout/SoundProvider';

function App() {
  const [booted, setBooted] = useState(false);

  return (
    <SoundProvider>
      <main className="w-full h-screen relative overflow-hidden bg-[#0F1729]">
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
            <motion.div
              key="mobile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="absolute inset-0"
            >
              <MobileLayout />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </SoundProvider>
  );
}

export default App;