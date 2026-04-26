import { motion } from 'motion/react';
import { useCMS } from '../context/CMSContext';

export default function Loader() {
  const { content } = useCMS();
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="flex flex-col items-center"
      >
        {content.logo_img ? (
          <img 
            src={content.logo_img} 
            alt="Logo" 
            className="h-24 w-auto mb-6 object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="text-primary text-4xl font-bold mb-6">
            {content.logo_text || "OX HYGIÈNE AGRO"}
          </div>
        )}
        
        <div className="w-48 h-1 bg-slate-100 mt-6 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
