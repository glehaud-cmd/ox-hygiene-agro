import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';
import { Leaf, Droplets, Wheat, Sprout, Search, Shield, Bug, MousePointer2, FlaskConical } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Products() {
  const { content, isEditing } = useCMS();
  const [searchTerm, setSearchTerm] = useState('');

  const allProducts = [
    { id: "toumoux", category: "insecticides" },
    { id: "caovitex", category: "insecticides" },
    { id: "borex", category: "insecticides" },
    { id: "buterax", category: "insecticides" },
    { id: "metrinex", category: "insecticides" },
    { id: "gradex", category: "herbicides" },
    { id: "rivitex", category: "herbicides" },
    { id: "vilatex", category: "stimulants" },
    { id: "raticidex", category: "raticides" }
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const name = content[`product_${p.id}_name`] || "";
      const nature = content[`product_${p.id}_nature`] || "";
      const utilisation = content[`product_${p.id}_utilisation`] || "";
      
      // Hide empty products if not in edit mode
      if (!isEditing && !name.trim()) return false;
      
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return name.toLowerCase().includes(term) || 
             nature.toLowerCase().includes(term) || 
             utilisation.toLowerCase().includes(term);
    });
  }, [searchTerm, content, isEditing]);

  return (
    <section id="produits" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-accent font-semibold tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <EditableText contentKey="products_title" />
          </motion.h2>
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <EditableText contentKey="products_subtitle" />
          </motion.h3>
          
          <div className="relative max-w-xl mx-auto mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un produit (nom, type, culture)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-4 pl-12 pr-4 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 group hover:shadow-xl transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
            >
              <div className="h-56 relative overflow-hidden">
                <EditableImage 
                  contentKey={`product_${product.id}_img`} 
                  className="w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <EditableText contentKey={`product_${product.id}_nature`} />
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h4 className="text-xl font-bold text-primary mb-2">
                  <EditableText contentKey={`product_${product.id}_name`} />
                </h4>
                <div className="text-slate-500 text-sm mb-4">
                  <EditableText contentKey={`product_${product.id}_formulation`} />
                </div>
                
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                      <Wheat className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Utilisation</span>
                      <span className="font-medium text-slate-700">
                        <EditableText contentKey={`product_${product.id}_utilisation`} />
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase font-bold">Dose d'application</span>
                      <span className="font-medium text-slate-700">
                        <EditableText contentKey={`product_${product.id}_dose`} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">Aucun produit ne correspond à votre recherche.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 text-accent font-bold hover:underline"
            >
              Voir tous les produits
            </button>
          </div>
        )}

        <motion.div 
          className="mt-20 bg-primary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <Shield className="w-16 h-16 text-accent mx-auto mb-6" />
            <h4 className="text-2xl md:text-3xl font-bold mb-4">Besoin d'un conseil technique ?</h4>
            <p className="text-white/80 text-lg mb-8">
              Nos experts sont à votre disposition pour vous accompagner dans le choix et l'utilisation optimale de nos solutions phytosanitaires.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-accent/20"
            >
              Contacter un expert
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
