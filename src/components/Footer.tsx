import { ShieldCheck, Facebook, Linkedin, Instagram, Twitter, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';
import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Footer() {
  const { content } = useCMS();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Newsletter error:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 lg:col-span-1">
            <div className="mb-6">
              <div className="inline-block bg-white p-2 rounded-xl shadow-md border border-white/20">
                <EditableImage 
                  contentKey="logo_img" 
                  className="h-10 w-auto" 
                  imgClassName="h-10 w-auto object-contain" 
                />
              </div>
              {!content.logo_img && (
                <span className="text-lg font-bold text-white tracking-tight block mt-3">
                  <EditableText contentKey="logo_text" />
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              <EditableText contentKey="footer_desc" />
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                {content.social_facebook && (
                  <a href={content.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {useCMS().isEditing && (
                  <div className="text-[10px] bg-white/5 p-1 rounded border border-white/10">
                    <EditableText contentKey="social_facebook" className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {content.social_linkedin && (
                  <a href={content.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {useCMS().isEditing && (
                  <div className="text-[10px] bg-white/5 p-1 rounded border border-white/10">
                    <EditableText contentKey="social_linkedin" className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {content.social_instagram && (
                  <a href={content.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {useCMS().isEditing && (
                  <div className="text-[10px] bg-white/5 p-1 rounded border border-white/10">
                    <EditableText contentKey="social_instagram" className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {content.social_twitter && (
                  <a href={content.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {useCMS().isEditing && (
                  <div className="text-[10px] bg-white/5 p-1 rounded border border-white/10">
                    <EditableText contentKey="social_twitter" className="text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Liens Rapides</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-accent transition-colors">Accueil</Link></li>
              <li><Link to="/presentation" className="hover:text-accent transition-colors">Notre Entreprise</Link></li>
              <li><Link to="/departement-agro" className="hover:text-accent transition-colors">Départements et Produits</Link></li>
              <li><Link to="/actualites" className="hover:text-accent transition-colors">Actualités</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Contact & Infos</h4>
            <ul className="space-y-3 text-sm">
              <li><span className="text-white font-medium">Siège :</span> <EditableText contentKey="footer_address" /></li>
              <li><span className="text-white font-medium">Tél :</span> <EditableText contentKey="footer_phone" /></li>
              <li><span className="text-white font-medium">Cel :</span> <EditableText contentKey="footer_mobile" /></li>
              <li><span className="text-white font-medium">WhatsApp :</span> <EditableText contentKey="footer_whatsapp" /></li>
              <li><span className="text-white font-medium">Email :</span> <EditableText contentKey="footer_email" /></li>
              <li><span className="text-white font-medium">Horaires :</span> <EditableText contentKey="footer_hours" /></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm"><EditableText contentKey="footer_newsletter_title" /></h4>
            <p className="text-sm mb-4"><EditableText contentKey="footer_newsletter_desc" /></p>
            {isSubmitted ? (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-400/10 p-3 rounded-md border border-green-400/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Merci pour votre inscription !</span>
              </div>
            ) : (
              <form className="flex" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email" 
                  className="bg-white/10 border border-white/20 rounded-l-md px-4 py-2 w-full outline-none focus:border-accent text-white"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-r-md transition-colors font-medium disabled:opacity-70"
                >
                  {isSubmitting ? "..." : "OK"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Agréments Section */}
        <div className="border-t border-white/10 pt-10 pb-2 mt-10 mb-8">
          <div className="text-center mb-10">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <ShieldCheck className="w-6 h-6 text-accent" />
              Agréments & Certifications
            </h3>
            <p className="text-slate-400 max-w-2xl mx-auto">OX HYGIENE Agro CI dispose des agréments suivants :</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dept Agro */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-colors">
              <h4 className="text-accent font-semibold mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Département Agro
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                  <span className="leading-tight">Un Agrément Importateur de produits phytosanitaires</span>
                </li>
              </ul>
            </div>

            {/* Dept Applicateur */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-colors">
              <h4 className="text-accent font-semibold mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Département Applicateur
              </h4>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                  <span className="leading-tight">Un Agrément Applicateur de produits phytosanitaires</span>
                </li>
              </ul>
            </div>

            {/* Dept Biotech */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-accent/30 transition-colors">
              <h4 className="text-accent font-semibold mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent"></span>
                Département Biotech
              </h4>
              
              <div className="mb-5">
                <h5 className="text-white font-medium text-xs uppercase mb-2 bg-white/10 inline-block px-2 py-1 rounded">Service Engrais</h5>
                <p className="text-xs text-slate-400 mb-3">La structure dispose de trois Agréments dans le domaine des engrais à savoir :</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Un agrément Importateur d'engrais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Un agrément Distributeur Grossiste d'engrais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Un Agrément Distributeur détaillant d'engrais</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10">
                <h5 className="text-white font-medium text-xs uppercase mb-2 bg-white/10 inline-block px-2 py-1 rounded">Service Semences</h5>
                <p className="text-xs text-slate-400 mb-3">La structure dispose de trois Agréments dans le domaine des semences à savoir :</p>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Un Agrément importateur</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Un Agrément Distributeur-Grossiste</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <span>Un Agrément Distributeur-détaillant de Semence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} <EditableText contentKey="logo_text" />. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="hover:text-accent transition-colors">Mentions Légales</Link>
            <Link to="/politique-confidentialite" className="hover:text-accent transition-colors">Confidentialité</Link>
            <span className="text-slate-400"><EditableText contentKey="footer_rccm" /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
