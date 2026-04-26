import { useCMS } from '../context/CMSContext';
import { LogIn, LogOut, ShieldCheck, Edit3, Save, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user, login, logout, isEditing, toggleEditMode } = useCMS();
  const navigate = useNavigate();
  const ADMIN_EMAILS = ["glehaudbongnenetcesar@gmail.com", "ephremattia82@gmail.com"];

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
      >
        <div className="bg-primary p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Espace Administration</h1>
          <p className="text-white/70 text-sm mt-2">Gérez le contenu de votre site</p>
        </div>

        <div className="p-8">
          {!user ? (
            <div className="text-center">
              <p className="text-slate-600 mb-8">
                Veuillez vous connecter avec votre compte administrateur pour accéder aux outils d'édition.
              </p>
              <button
                onClick={login}
                className="w-full flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent/20"
              >
                <LogIn className="w-5 h-5" />
                Se connecter avec Google
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                {user.photoURL && (
                  <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                )}
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connecté en tant que</p>
                  <p className="text-slate-800 font-medium truncate">{user.email}</p>
                </div>
              </div>

              {isAdmin ? (
                <div className="space-y-4">
                  <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Accès administrateur autorisé
                  </div>
                  
                  <button
                    onClick={toggleEditMode}
                    className={`w-full flex items-center justify-center gap-3 font-bold py-4 rounded-xl transition-all shadow-lg ${
                      isEditing 
                        ? 'bg-blue-600 text-white shadow-blue-500/20' 
                        : 'bg-slate-800 text-white shadow-slate-900/20 hover:bg-slate-900'
                    }`}
                  >
                    {isEditing ? (
                      <><Save className="w-5 h-5" /> Désactiver le mode édition</>
                    ) : (
                      <><Edit3 className="w-5 h-5" /> Activer le mode édition</>
                    )}
                  </button>

                  <Link
                    to="/"
                    className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Retour au site
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
                    Désolé, cet e-mail n'est pas autorisé à modifier le site.
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 bg-slate-800 text-white font-bold py-4 rounded-xl hover:bg-slate-900 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Se déconnecter
                  </button>
                </div>
              )}

              {isAdmin && (
                <button
                  onClick={logout}
                  className="w-full text-slate-400 hover:text-red-500 text-sm font-medium transition-colors pt-4"
                >
                  Se déconnecter
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
      
      <Link to="/" className="mt-8 text-slate-400 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Retour à l'accueil
      </Link>
    </div>
  );
}
