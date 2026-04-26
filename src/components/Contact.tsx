import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import EditableText from './cms/EditableText';
import { useCMS } from '../context/CMSContext';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const { content } = useCMS();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: 'Dératisation',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'contacts'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: 'Dératisation',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-accent font-semibold tracking-wider uppercase mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <EditableText contentKey="contact_title" />
          </motion.h2>
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <EditableText contentKey="contact_subtitle" />
          </motion.h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div 
            className="lg:col-span-1 space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="text-xl font-bold text-primary mb-6"><EditableText contentKey="contact_info_title" /></h4>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full text-accent">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Localisation</h5>
                    <p className="text-slate-600 mt-1"><EditableText contentKey="footer_address" /></p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full text-accent">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Téléphones</h5>
                    <p className="text-slate-600 mt-1"><EditableText contentKey="footer_phone" /></p>
                    <p className="text-slate-600"><EditableText contentKey="footer_mobile" /></p>
                    <p className="text-slate-600"><EditableText contentKey="footer_whatsapp" /> (WhatsApp)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-accent/10 p-3 rounded-full text-accent">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800">Email</h5>
                    <p className="text-slate-600 mt-1"><EditableText contentKey="footer_email" /></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 h-[300px] relative group">
              <iframe 
                src={content.google_maps_url}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation OX HYGIENE Agro CI"
              ></iframe>
              {useCMS().isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white p-4 rounded-xl w-full max-w-sm">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">URL Iframe Google Maps</p>
                    <EditableText contentKey="google_maps_url" className="text-sm break-all" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isSubmitted ? (
              <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100 text-center flex flex-col items-center justify-center h-full">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
                <h4 className="text-2xl font-bold text-primary mb-4">Message Envoyé !</h4>
                <p className="text-slate-600 mb-8">Merci de nous avoir contactés. Notre équipe vous répondra dans les plus brefs délais.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Nom complet</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">Entreprise</label>
                    <input 
                      type="text" 
                      id="company" 
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
                      placeholder="+225 ..."
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-2">Service ou Produit souhaité</label>
                  <select 
                    id="service" 
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all bg-white"
                  >
                    <option>Dératisation</option>
                    <option>Désinsectisation</option>
                    <option>Protection Reptiles</option>
                    <option>Démoustication</option>
                    <option>Solutions Agricoles (Engrais, Semences...)</option>
                    <option>Autre</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all resize-none"
                    placeholder="Décrivez votre besoin..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer la demande
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
