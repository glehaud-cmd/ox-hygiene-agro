import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';
import EditableBackground from './cms/EditableBackground';

export default function About() {
  return (
    <EditableBackground contentKey="about_bg" className="py-24 overflow-hidden min-h-[80vh] flex items-center">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <EditableImage contentKey="about_img" className="w-full h-full" />
              <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>
            </div>
            <motion.div 
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-xl border-l-4 border-accent hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="text-4xl font-bold text-primary mb-1"><EditableText contentKey="about_badge_value" /></div>
              <div className="text-slate-600 font-medium"><EditableText contentKey="about_badge_label" /></div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-accent font-semibold tracking-wider uppercase mb-3">
              <EditableText contentKey="about_title" />
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
              <EditableText contentKey="about_subtitle" />
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              <EditableText contentKey="about_text1" />
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              <EditableText contentKey="about_text2" />
            </p>

            <motion.div 
              className="bg-slate-50 border-l-4 border-accent p-6 mb-10 rounded-r-xl italic shadow-sm"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-700 font-medium leading-relaxed">
                "Notre équipe est composée d'experts et de techniciens expérimentés et qualifiés dans la lutte contre les nuisibles et la préservation de la qualité de votre cadre de vie."
              </p>
            </motion.div>

            <ul className="space-y-4 mb-10">
              {[1, 2, 3, 4].map((i, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                  <EditableText contentKey={`about_list_${i}`} />
                </motion.li>
              ))}
            </ul>

            <a 
              href="#services" 
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Découvrir nos services
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </div>
      </div>
    </EditableBackground>
  );
}
