import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import EditableImage from './EditableImage';

interface DynamicGalleryProps {
  contentKey: string;
  title: string;
}

export default function DynamicGallery({ contentKey, title }: DynamicGalleryProps) {
  const { content, updateContent, isEditing } = useCMS();
  
  // Get current images from content
  const images = JSON.parse(content[contentKey] || '[]');

  const addImage = () => {
    const newImages = [...images, `placeholder_${Date.now()}`];
    updateContent(contentKey, JSON.stringify(newImages));
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    updateContent(contentKey, JSON.stringify(newImages));
  };

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-primary flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-accent" />
          {title}
        </h3>
        {isEditing && (
          <button
            onClick={addImage}
            className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-accent/20"
          >
            <Plus className="w-4 h-4" />
            Ajouter une photo
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {images.map((imgKey: string, idx: number) => (
            <motion.div
              key={imgKey}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group aspect-square rounded-2xl overflow-hidden shadow-md bg-slate-100"
            >
              <EditableImage 
                contentKey={imgKey} 
                className="w-full h-full" 
                imgClassName="w-full h-full object-cover"
              />
              
              {isEditing && (
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title="Supprimer cette photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {images.length === 0 && !isEditing && (
          <div className="col-span-full py-12 text-center text-slate-400 italic bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            Aucune photo dans cette galerie pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
