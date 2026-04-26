import { motion } from 'motion/react';
import { Award, Clock, Shield, CheckSquare, Users } from 'lucide-react';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';

const icons = [Award, Clock, Shield, CheckSquare, Users];

export default function WhyUs() {
  return (
    <section id="pourquoi-nous" className="py-24 bg-primary text-white relative overflow-hidden">
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border-[20px] border-white"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-[10px] border-accent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-semibold tracking-wider uppercase mb-3"><EditableText contentKey="why_us_title" /></h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <EditableText contentKey="why_us_subtitle" />
            </h3>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              <EditableText contentKey="why_us_desc" />
            </p>
            
            <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
              <EditableImage 
                contentKey="why_us_img" 
                className="w-full h-full"
                imgClassName="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5].map((i, index) => {
              const Icon = icons[index];
              return (
                <motion.div
                  key={i}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors ${
                    index === 4 ? 'sm:col-span-2 sm:w-1/2 sm:mx-auto' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-accent/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h4 className="text-xl font-bold mb-2"><EditableText contentKey={`why_us_${i}_title`} /></h4>
                  <p className="text-slate-400 text-sm"><EditableText contentKey={`why_us_${i}_desc`} /></p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
