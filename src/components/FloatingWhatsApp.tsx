import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import EditableText from './cms/EditableText';

export default function FloatingWhatsApp() {
  return (
    <motion.a
      href="https://wa.me/2250708000011?text=Bonjour%20OX%20HYGI%C3%88NE%20AGRO%20CI%2C%20je%20souhaite%20avoir%20des%20renseignements%20sur%20vos%20services."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-[#20bd5a] transition-all flex items-center justify-center group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-medium py-2 px-4 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        <EditableText contentKey="whatsapp_tooltip" />
        {/* Triangle pointer */}
        <span className="absolute top-1/2 -right-2 -translate-y-1/2 border-8 border-transparent border-l-white"></span>
      </span>
    </motion.a>
  );
}
