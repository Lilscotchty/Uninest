import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useAppContext();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-[100px] left-1/2 -translate-x-1/2 md:bottom-6 md:right-6 md:left-auto md:translate-x-0 z-[1000] bg-indigo-dark text-white py-2.5 px-5 rounded-full shadow-[0_6px_20px_rgba(30,27,75,0.3)] font-medium text-[0.82rem] whitespace-nowrap pointer-events-none"
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
