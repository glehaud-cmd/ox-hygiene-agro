import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Plus, Filter, ArrowRight, FileText, Settings } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { NewsItem, NewsType } from '../types/news';
import NewsCard from '../components/news/NewsCard';
import NewsManager from '../components/news/NewsManager';
import EditableText from '../components/cms/EditableText';
import EditableBackground from '../components/cms/EditableBackground';

export default function Actualites() {
  const { content, isEditing, toggleEditMode, updateContent } = useCMS();
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<NewsItem | null>(null);
  const [filter, setFilter] = useState<NewsType | 'all'>('all');

  const newsItems: NewsItem[] = useMemo(() => {
    try {
      return JSON.parse(content.news_items || '[]');
    } catch (e) {
      console.error("Error parsing news_items", e);
      return [];
    }
  }, [content.news_items]);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return newsItems;
    return newsItems.filter(item => item.type === filter);
  }, [newsItems, filter]);

  const featuredItems = useMemo(() => newsItems.filter(item => item.featured), [newsItems]);

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      const updatedNews = newsItems.filter(item => item.id !== id);
      updateContent('news_items', JSON.stringify(updatedNews));
    }
  };

  const handleEdit = (item: NewsItem) => {
    setItemToEdit(item);
    setIsManagerOpen(true);
  };

  const handleAddNew = () => {
    setItemToEdit(null);
    setIsManagerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      {/* Hero Section */}
      <EditableBackground
        contentKey="news_page_bg"
        className="relative py-24 bg-primary text-white overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EditableText contentKey="news_page_title" />
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <EditableText contentKey="news_page_subtitle" />
          </motion.p>
        </div>
      </EditableBackground>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Admin Controls */}
        {isEditing && (
          <div className="mb-12 p-6 bg-white rounded-2xl shadow-sm border border-accent/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-primary">Gestion des Actualités</h3>
              <p className="text-sm text-slate-500">Ajoutez, modifiez ou supprimez vos publications.</p>
            </div>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              Ajouter une publication
            </button>
          </div>
        )}

        {/* Featured News Carousel */}
        {featuredItems.length > 0 && filter === 'all' && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-accent rounded-full"></span>
              À la Une
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar">
              {featuredItems.map((item, index) => (
                <div key={item.id} className="min-w-[85vw] md:min-w-[600px] lg:min-w-[800px] snap-center">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col md:flex-row group h-full">
                    <div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                      <img 
                        src={content[item.coverImage || ''] || item.coverImage || 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop'} 
                        alt={item.title}
                        className={`w-full h-full transform group-hover:scale-105 transition-transform duration-700 ${item.coverImageFit === 'contain' ? 'object-contain bg-slate-50' : 'object-cover'}`}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop";
                          target.onerror = null;
                        }}
                      />
                      <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        En vedette
                      </div>
                    </div>
                    <div className="p-8 md:w-1/2 flex flex-col justify-center">
                      <div className="text-accent text-sm font-bold mb-2 uppercase tracking-wider">
                        {item.type === 'gallery' ? 'Galerie' : item.type === 'video' ? 'Vidéo' : 'Article'}
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 mb-6">
                        {item.summary}
                      </p>
                      <button 
                        onClick={() => window.location.href = `/actualites/${item.id}`}
                        className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-primary px-6 py-3 rounded-full font-medium transition-colors mt-auto self-start"
                      >
                        Découvrir <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2 text-slate-500 mr-4">
            <Filter className="w-5 h-5" />
            <span className="font-medium">Filtrer :</span>
          </div>
          {[
            { id: 'all', label: 'Tout voir' },
            { id: 'article', label: 'Articles' },
            { id: 'gallery', label: 'Galeries Photos' },
            { id: 'video', label: 'Vidéos' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                filter === f.id 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
                <NewsCard 
                  key={item.id} 
                  item={item} 
                  index={index} 
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  canEdit={isEditing}
                />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Aucune publication</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Il n'y a pas encore de contenu dans cette catégorie. 
              {isEditing && " Cliquez sur 'Ajouter une publication' pour commencer."}
            </p>
          </div>
        )}
      </div>

      {/* News Manager Modal */}
      {isManagerOpen && (
        <NewsManager 
          isOpen={isManagerOpen} 
          onClose={() => setIsManagerOpen(false)} 
          itemToEdit={itemToEdit} 
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
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Ajouter une publication</span>
              <span className="sm:hidden">Ajouter</span>
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
