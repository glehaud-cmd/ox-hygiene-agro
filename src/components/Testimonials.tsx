import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, X, Send, CheckCircle2, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableText from './cms/EditableText';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % 3);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + 3) % 3);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ name: '', role: '', content: '', rating: 5 });
    }, 3000);
  };

  return (
    <section className="py-24 bg-slate-50 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Quote className="w-16 h-16 text-accent/20 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-12">
            <EditableText contentKey="testimonials_title" />
          </h2>
        </motion.div>

        <div className="relative h-[250px] md:h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <p className="text-xl md:text-2xl text-slate-600 italic mb-8 leading-relaxed">
                "<EditableText contentKey={`testimonials_${currentIndex + 1}_text`} />"
              </p>
              <div>
                <h4 className="text-lg font-bold text-primary"><EditableText contentKey={`testimonials_${currentIndex + 1}_author`} /></h4>
                <p className="text-accent font-medium"><EditableText contentKey={`testimonials_${currentIndex + 1}_role`} /></p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button 
            onClick={prev}
            className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="w-12 h-12 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg"
          >
            <MessageSquare className="w-5 h-5" />
            Donner mon avis
          </button>
        </motion.div>
      </div>

      {/* Testimonial Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-primary text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Votre avis nous intéresse
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h4 className="text-2xl font-bold text-primary mb-2">Merci pour votre avis !</h4>
                    <p className="text-slate-600">Votre témoignage a été envoyé avec succès et sera publié après validation.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Nom complet</label>
                        <input 
                          required
                          type="text" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                          placeholder="Ex: Jean Kouassi"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Fonction / Entreprise</label>
                        <input 
                          required
                          type="text" 
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                          placeholder="Ex: Agriculteur"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700">Note</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({...formData, rating: star})}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <label className="text-sm font-semibold text-slate-700">Votre témoignage</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Partagez votre expérience avec nos produits et services..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      Envoyer mon avis
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
