import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EditableImage from './cms/EditableImage';
import EditableText from './cms/EditableText';
import { useCMS } from '../context/CMSContext';

const SLIDE_COUNT = 6;

export default function Hero() {
  const { content, isEditing } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(1);

  useEffect(() => {
    if (isEditing) return; // Pause auto-slide while editing
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev % SLIDE_COUNT) + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [isEditing]);

  const nextSlide = () => setCurrentSlide((prev) => (prev % SLIDE_COUNT) + 1);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 1 ? SLIDE_COUNT : prev - 1));

  return (
    <div className="relative h-screen min-h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-slate-900"
        >
          <EditableImage 
            contentKey={`hero_slide_${currentSlide}_img`} 
            className="w-full h-full" 
            alt={`Slide ${currentSlide}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle gradient just for bottom controls visibility, no blue fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-0"></div>

      {/* Slider Controls */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 sm:px-8 z-20 pointer-events-none">
        <button 
          onClick={prevSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 h-full flex items-end pb-32 justify-center">
        {/* Text removed as requested to show photos clearly */}
      </div>
      
      {/* Slider Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === i ? 'bg-accent scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1"
        >
          <div className="w-1.5 h-2 bg-accent rounded-full"></div>
        </motion.div>
      </motion.div>
    </div>
  );
}
