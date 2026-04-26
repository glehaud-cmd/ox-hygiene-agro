import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useCMS } from '../context/CMSContext';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';

function Counter({ from, to, duration, suffix }: { from: number, to: number, duration: number, suffix: string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, from, to, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  const { content, isEditing } = useCMS();

  return (
    <section className="py-20 bg-accent relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay">
        <EditableImage contentKey="stats_bg" className="w-full h-full object-cover" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
          {[1, 2, 3].map((i, index) => {
            const val = parseInt(content[`stats_${i}_value`] || "0", 10);
            return (
              <motion.div
                key={i}
                className="py-6 md:py-0"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div className="text-5xl md:text-6xl font-bold text-white mb-2 font-heading">
                  {isEditing ? (
                    <>
                      <EditableText contentKey={`stats_${i}_value`} />
                      <EditableText contentKey={`stats_${i}_suffix`} />
                    </>
                  ) : (
                    <Counter from={0} to={val} duration={2} suffix={content[`stats_${i}_suffix`] || ""} />
                  )}
                </div>
                <div className="text-white/80 text-lg font-medium uppercase tracking-wider">
                  <EditableText contentKey={`stats_${i}_label`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
