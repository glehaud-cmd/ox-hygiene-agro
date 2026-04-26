import { motion } from 'motion/react';
import { Leaf, FlaskConical, ShieldAlert, ShoppingBag, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';
import EditableBackground from './cms/EditableBackground';

const icons = [Leaf, FlaskConical, ShieldAlert, ShoppingBag, Bug];
const links = [
  "/departement-agro",
  "/departement-biotech",
  "/departement-applicateur",
  "/catalogue-produits",
  "/contact"
];

export default function Services() {
  return (
    <div id="services">
      <EditableBackground contentKey="services_bg" className="py-24 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-sm pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-accent font-semibold tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Nos Domaines d'Intervention
          </motion.h2>
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <EditableText contentKey="services_title" />
          </motion.h3>
          <motion.div 
            className="text-slate-600 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
              <EditableText contentKey="services_hook_bold" />
            </p>
            <p className="text-sm md:text-base opacity-80 max-w-2xl mx-auto">
              <EditableText contentKey="services_hook_small" />
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5].map((i, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={i}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col min-h-[450px]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex-grow flex flex-col">
                  <div className="h-56 overflow-hidden relative">
                    <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors z-10 pointer-events-none"></div>
                    <EditableImage 
                      contentKey={`service_${i}_img`} 
                      className="w-full h-full transform group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 right-4 z-20 bg-white p-3 rounded-full shadow-md text-primary group-hover:text-accent group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="p-8 relative z-20 bg-white flex-grow">
                    <h4 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                      <EditableText contentKey={`service_${i}_title`} />
                    </h4>
                    <div className="text-slate-700 text-sm md:text-base leading-relaxed">
                      <EditableText contentKey={`service_${i}_desc`} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                    <div className="h-full bg-accent w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      </EditableBackground>
    </div>
  );
}
