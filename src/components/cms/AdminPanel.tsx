import { useCMS } from '../../context/CMSContext';
import { Settings, Save, Edit3, LogOut, LogIn, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const { isEditing, toggleEditMode, user, logout } = useCMS();
  const navigate = useNavigate();
  const ADMIN_EMAILS = ["glehaudbongnenetcesar@gmail.com", "glehaudbc@gmail.com"];

  // Only show if user is the admin
  if (!user || !ADMIN_EMAILS.includes(user.email || "")) return null;

  return (
    <>
      <motion.div 
        className="fixed bottom-6 left-6 z-[100] flex items-center gap-3 bg-white p-3 rounded-full shadow-2xl border border-slate-200"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full text-slate-600">
          <Settings className="w-5 h-5" />
        </div>
        <div className="pr-2 flex items-center gap-3">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {user.email}
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleEditMode}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isEditing ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {isEditing ? (
                  <><Save className="w-4 h-4" /> Quitter l'édition</>
                ) : (
                  <><Edit3 className="w-4 h-4" /> Éditer le site</>
                )}
              </button>
              
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-xs font-bold"
              >
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isEditing && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group"
          onClick={() => navigate('/actualites')}
          title="Ajouter un article, photo ou vidéo"
        >
          <Plus className="w-8 h-8" />
          <span className="absolute right-full mr-4 bg-primary text-white px-3 py-1 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ajouter du contenu
          </span>
        </motion.button>
      )}
    </>
  );
}
