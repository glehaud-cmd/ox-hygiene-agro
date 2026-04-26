import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Image as ImageIcon, Video, FileText, Edit, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../../types/news';
import { useCMS } from '../../context/CMSContext';

interface NewsCardProps {
  item: NewsItem;
  index: number;
  onEdit?: (item: NewsItem) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, index, onEdit, onDelete, canEdit }) => {
  const { isEditing, content } = useCMS();
  
  // Use the passed canEdit prop, or fallback to the global isEditing state
  const isEditable = canEdit !== undefined ? canEdit : isEditing;

  const getIcon = () => {
    switch (item.type) {
      case 'gallery': return <ImageIcon className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (item.type) {
      case 'gallery': return 'Galerie';
      case 'video': return 'Vidéo';
      default: return 'Article';
    }
  };

  return (
    <motion.article
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 flex flex-col group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      {isEditable && (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); onEdit?.(item); }}
            className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onDelete?.(item.id); }}
            className="p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      )}

      <Link to={`/actualites/${item.id}`} className="flex-1 flex flex-col">
        <div className="h-48 overflow-hidden relative">
          <img 
            src={content[item.coverImage || ''] || item.coverImage || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?q=80&w=1974&auto=format&fit=crop'} 
            alt={item.title}
            className={`w-full h-full transform group-hover:scale-105 transition-transform duration-700 ${item.coverImageFit === 'contain' ? 'object-contain bg-slate-50' : 'object-cover'}`} 
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1584467735815-f778f274e296?q=80&w=1974&auto=format&fit=crop";
              target.onerror = null;
            }}
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1.5 shadow-sm">
            {getIcon()}
            {getTypeLabel()}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-3">
            <Calendar className="w-4 h-4" />
            <span>{new Date(item.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
            {item.title}
          </h4>
          <p className="text-slate-600 text-sm mb-4 flex-1">
            {item.summary}
          </p>
          <span className="text-accent text-sm font-semibold flex items-center gap-1 mt-auto group-hover:gap-2 transition-all">
            {item.type === 'gallery' ? 'Voir la galerie' : item.type === 'video' ? 'Voir la vidéo' : 'Lire la suite'} 
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default NewsCard;
