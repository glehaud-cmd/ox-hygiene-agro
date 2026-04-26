import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Image as ImageIcon, Video, FileText, Edit, Trash, Settings, Plus } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { NewsItem } from '../types/news';
import NewsManager from '../components/news/NewsManager';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { content, isEditing, toggleEditMode, updateContent } = useCMS();
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  const newsItem = useMemo(() => {
    try {
      const items: NewsItem[] = JSON.parse(content.news_items || '[]');
      return items.find(item => item.id === id);
    } catch (e) {
      console.error("Error parsing news_items", e);
      return null;
    }
  }, [content.news_items, id]);

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Publication introuvable</h2>
          <p className="text-slate-600 mb-8">L'article ou la galerie que vous cherchez n'existe plus.</p>
          <Link to="/actualites" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-medium hover:bg-accent-hover transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  const getIcon = () => {
    switch (newsItem.type) {
      case 'gallery': return <ImageIcon className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (newsItem.type) {
      case 'gallery': return 'Galerie Photos';
      case 'video': return 'Vidéo';
      default: return 'Article';
    }
  };

  // Extract YouTube ID for embed
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      const items: NewsItem[] = JSON.parse(content.news_items || '[]');
      const updatedNews = items.filter(item => item.id !== id);
      updateContent('news_items', JSON.stringify(updatedNews));
      navigate('/actualites');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-24">
      {/* Hero Header */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-primary overflow-hidden">
        <img 
          src={content[newsItem.coverImage || ''] || newsItem.coverImage || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop'} 
          alt={newsItem.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={() => navigate('/actualites')}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
              
              {isEditing && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsManagerOpen(true)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center gap-2 bg-red-500/80 hover:bg-red-500 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
                {getIcon()}
                {getTypeLabel()}
              </span>
              <span className="text-white/80 text-sm font-medium flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(newsItem.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {newsItem.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
          
          {/* Summary */}
          {newsItem.summary && (
            <div className="text-xl text-slate-600 font-medium leading-relaxed mb-10 border-l-4 border-accent pl-6">
              {newsItem.summary}
            </div>
          )}

          {/* Article Content */}
          {newsItem.type === 'article' && newsItem.content && (
            <div className="prose prose-lg prose-slate max-w-none">
              {newsItem.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Video Content */}
          {newsItem.type === 'video' && newsItem.videoUrl && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900 mb-8">
              <iframe 
                src={getYoutubeEmbedUrl(newsItem.videoUrl)} 
                title={newsItem.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Gallery Content */}
          {newsItem.type === 'gallery' && newsItem.galleryImages && newsItem.galleryImages.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-accent" />
                Galerie Photos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {newsItem.galleryImages.map((img, idx) => (
                  <motion.div 
                    key={idx}
                    className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => window.open(content[img] || img, '_blank')}
                  >
                    <img 
                      src={content[img] || img} 
                      alt={`Gallery image ${idx + 1}`} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop";
                        target.onerror = null;
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* News Manager Modal */}
      {isManagerOpen && (
        <NewsManager 
          isOpen={isManagerOpen} 
          onClose={() => setIsManagerOpen(false)} 
          itemToEdit={newsItem} 
        />
      )}

      {/* Floating Admin Button for News (Visible only when not in global edit mode) */}
      {!isEditing && (
        <button
          onClick={toggleEditMode}
          className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl bg-primary hover:bg-primary/90 text-white hover:scale-110 transition-all duration-300 flex items-center justify-center"
          title="Activer le mode administration complet"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}

      {/* Admin Bottom Bar */}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 flex justify-between items-center px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-slate-800 hidden sm:inline">Mode Administration (Actualités)</span>
            <span className="font-bold text-slate-800 sm:hidden">Admin</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => setIsManagerOpen(true)}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Edit className="w-5 h-5" />
              <span className="hidden sm:inline">Modifier cette publication</span>
              <span className="sm:hidden">Modifier</span>
            </button>
            <button 
              onClick={toggleEditMode}
              className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2"
            >
              Quitter le mode admin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
