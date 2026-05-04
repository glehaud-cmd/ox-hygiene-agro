import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CMSProvider } from './context/CMSContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Products from './components/Products';
import News from './components/News';
import WhyUs from './components/WhyUs';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Loader from './components/Loader';
import AdminPanel from './components/cms/AdminPanel';
import Admin from './pages/Admin';
import GenericPage from './pages/GenericPage';
import Actualites from './pages/Actualites';
import NewsDetail from './pages/NewsDetail';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import ScrollToTop from './components/ScrollToTop';

const Home = () => (
  <>
    <Hero />
    <About />
    <Services />
    <WhyUs />
    <Stats />
    <Testimonials />
    <News />
  </>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <CMSProvider>
      <Router>
        <ScrollToTop />
        {loading ? (
          <Loader />
        ) : (
          <div className="relative w-full overflow-x-hidden">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/presentation" element={<About />} />
                <Route path="/partenaires-personnel" element={<GenericPage pageKey="partenaires" defaultTitle="Partenaires & Personnel" />} />
                <Route path="/departement-agro" element={<GenericPage pageKey="agro" defaultTitle="Département Agro" />} />
                <Route path="/departement-biotech" element={<GenericPage pageKey="biotech" defaultTitle="Département Biotech" />} />
                <Route path="/departement-applicateur" element={<GenericPage pageKey="applicateur" defaultTitle="Département Applicateur" />} />
                <Route path="/catalogue-produits" element={<Products />} />
                <Route path="/actualites" element={<Actualites />} />
                <Route path="/actualites/:id" element={<NewsDetail />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <FloatingWhatsApp />
            <AdminPanel />
          </div>
        )}
      </Router>
    </CMSProvider>
  );
}
