import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TopLoaderProps {
  isLoading: boolean;
}

const TopLoader: React.FC<TopLoaderProps> = ({ isLoading }) => {
  const [isVisible, setIsVisible] = useState(isLoading);

  // Sinkronkan isVisible dengan isLoading, tapi dengan kontrol untuk animasi keluar
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true);
    }
  }, [isLoading]);

  const handleAnimationComplete = () => {
    if (!isLoading) {
      setIsVisible(false); // Sembunyikan setelah animasi keluar selesai
    }
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 overflow-hidden">
      {isVisible && (
        <motion.div
          className="h-dvh bg-gradient-to-r from-black to-neutral-800 dark:from-white dark:to-neutral-200"
          initial={{ x: '-100%' }}
          animate={
            isLoading
              ? { x: '200%' } // Bergerak ke kanan saat loading
              : { x: '200%', opacity: 0 } // Keluar ke kanan sambil memudar saat selesai
          }
          transition={
            isLoading
              ? {
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 1.5,
                    ease: 'linear',
                  },
                }
              : {
                  x: {
                    duration: 0.5, // Durasi keluar
                    ease: 'easeOut',
                  },
                  opacity: {
                    duration: 0.3, // Fade out lebih cepat
                    ease: 'easeOut',
                  },
                }
          }
          style={{
            width: '50%',
          }}
          onAnimationComplete={handleAnimationComplete}
        />
      )}
    </div>
  );
};

export default TopLoader;
