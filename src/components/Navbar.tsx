import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import EditableText from './cms/EditableText';
import EditableImage from './cms/EditableImage';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { content } = useCMS();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileDropdown = (menu: string) => {
    setMobileDropdown(mobileDropdown === menu ? null : menu);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg ${
        isScrolled ? 'py-3' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <EditableImage contentKey="logo_img" className="h-10 w-auto" imgClassName="h-10 w-auto object-contain" />
            {!content.logo_img && (
              <span className="text-xl font-bold tracking-tight text-primary">
                <EditableText contentKey="logo_text" />
              </span>
            )}
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-accent text-slate-700">Accueil</Link>
            
            {/* Dropdown: Notre entreprise */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent text-slate-700">
                Notre entreprise <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100 border border-slate-100">
                <Link to="/presentation" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent border-b border-slate-100">Présentation</Link>
                <Link to="/partenaires-personnel" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent">Partenaires & personnel</Link>
              </div>
            </div>

            {/* Dropdown: Départements et Produits */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent text-slate-700">
                Départements et Produits <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-left scale-95 group-hover:scale-100 border border-slate-100">
                <Link to="/departement-agro" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent border-b border-slate-100">Département Agro</Link>
                <Link to="/departement-biotech" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent border-b border-slate-100">Département Biotech</Link>
                <Link to="/departement-applicateur" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent border-b border-slate-100">Département Applicateur</Link>
                <Link to="/catalogue-produits" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-accent">Catalogue Produits</Link>
              </div>
            </div>

            <Link to="/actualites" className="text-sm font-medium transition-colors hover:text-accent text-slate-700">Actualités</Link>
            
            <Link
              to="/contact"
              className="bg-accent hover:bg-accent-hover text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 transform hover:-translate-y-0.5 ml-4"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-primary"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[60] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <Link to="/" className="flex items-center gap-2">
                  <EditableImage contentKey="logo_img" className="h-8 w-auto" imgClassName="h-8 w-auto object-contain" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-2 bg-white">
                <Link to="/" className="block px-4 py-3 text-left text-lg font-bold text-primary hover:text-accent hover:bg-slate-50 rounded-xl transition-all">Accueil</Link>
                
                <div className="space-y-1">
                  <button onClick={() => toggleMobileDropdown('entreprise')} className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-bold text-primary hover:text-accent hover:bg-slate-50 rounded-xl transition-all">
                    <span>Notre entreprise</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'entreprise' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileDropdown === 'entreprise' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-l-2 border-slate-100 ml-6 pl-2 mt-1">
                        <Link to="/presentation" className="block px-4 py-3 text-left text-base font-medium text-slate-600 hover:text-accent rounded-lg hover:bg-slate-50">Présentation</Link>
                        <Link to="/partenaires-personnel" className="block px-4 py-3 text-left text-base font-medium text-slate-600 hover:text-accent rounded-lg hover:bg-slate-50">Partenaires & personnel</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1">
                  <button onClick={() => toggleMobileDropdown('departements')} className="w-full flex justify-between items-center px-4 py-3 text-left text-lg font-bold text-primary hover:text-accent hover:bg-slate-50 rounded-xl transition-all">
                    <span>Départements et Produits</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${mobileDropdown === 'departements' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {mobileDropdown === 'departements' && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white border-l-2 border-slate-100 ml-6 pl-2 mt-1">
                        <Link to="/departement-agro" className="block px-4 py-3 text-left text-base font-medium text-slate-600 hover:text-accent rounded-lg hover:bg-slate-50">Département Agro</Link>
                        <Link to="/departement-biotech" className="block px-4 py-3 text-left text-base font-medium text-slate-600 hover:text-accent rounded-lg hover:bg-slate-50">Département Biotech</Link>
                        <Link to="/departement-applicateur" className="block px-4 py-3 text-left text-base font-medium text-slate-600 hover:text-accent rounded-lg hover:bg-slate-50">Département Applicateur</Link>
                        <Link to="/catalogue-produits" className="block px-4 py-3 text-left text-base font-medium text-slate-600 hover:text-accent rounded-lg hover:bg-slate-50">Catalogue Produits</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link to="/actualites" className="block px-4 py-3 text-left text-lg font-bold text-primary hover:text-accent hover:bg-slate-50 rounded-xl transition-all">Actualités</Link>
                
                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to="/contact"
                    className="block w-full text-center bg-accent hover:bg-accent-hover text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-accent/20 transition-all"
                  >
                    Contactez-nous
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
