import React, { useState, useRef } from 'react';
import { X, Upload, Plus, Trash, Image as ImageIcon, FileText, Video } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { NewsItem, NewsType } from '../../types/news';
import { compressImage } from '../../utils/imageCompression';

interface NewsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: NewsItem | null;
}

export default function NewsManager({ isOpen, onClose, itemToEdit }: NewsManagerProps) {
  const { content, updateContent } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<NewsItem>>(
    itemToEdit || {
      id: Date.now().toString(),
      type: 'article',
      title: '',
      date: new Date().toISOString().split('T')[0],
      summary: '',
      content: '',
      coverImage: '',
      coverImageFit: 'cover',
      galleryImages: [],
      videoUrl: '',
      featured: false
    }
  );

  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    let currentNews: NewsItem[] = [];
    try {
      currentNews = JSON.parse(content.news_items || '[]');
    } catch (e) {
      console.error("Error parsing news_items", e);
    }

    if (itemToEdit) {
      currentNews = currentNews.map(item => item.id === itemToEdit.id ? formData as NewsItem : item);
    } else {
      currentNews = [formData as NewsItem, ...currentNews];
    }

    // Migrate any existing base64 images in news_items to content_images
    currentNews = currentNews.map(item => {
      const newItem = { ...item };
      if (newItem.coverImage && newItem.coverImage.startsWith('data:image/')) {
        const imageId = `news_img_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        updateContent(imageId, newItem.coverImage);
        newItem.coverImage = imageId;
      }
      if (newItem.galleryImages) {
        newItem.galleryImages = newItem.galleryImages.map((img, i) => {
          if (img.startsWith('data:image/')) {
            const imageId = `news_img_${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`;
            updateContent(imageId, img);
            return imageId;
          }
          return img;
        });
      }
      return newItem;
    });

    updateContent('news_items', JSON.stringify(currentNews));
    onClose();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'galleryImages') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      if (field === 'coverImage') {
        const compressed = await compressImage(files[0]);
        const imageId = `news_img_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        updateContent(imageId, compressed);
        setFormData({ ...formData, coverImage: imageId });
      } else {
        const newImages = [];
        for (let i = 0; i < files.length; i++) {
          const compressed = await compressImage(files[i]);
          const imageId = `news_img_${Date.now()}_${i}_${Math.random().toString(36).substring(7)}`;
          updateContent(imageId, compressed);
          newImages.push(imageId);
        }
        setFormData({ ...formData, galleryImages: [...(formData.galleryImages || []), ...newImages] });
      }
    } catch (error) {
      console.error("Error compressing image", error);
      alert("Erreur lors du traitement de l'image.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(formData.galleryImages || [])];
    newGallery.splice(index, 1);
    setFormData({ ...formData, galleryImages: newGallery });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">
            {itemToEdit ? 'Modifier la publication' : 'Nouvelle publication'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type de contenu</label>
            <div className="flex gap-4">
              {(['article', 'gallery', 'video'] as NewsType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-colors ${
                    formData.type === type 
                      ? 'border-accent bg-accent/5 text-accent' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {type === 'article' && <FileText className="w-5 h-5" />}
                  {type === 'gallery' && <ImageIcon className="w-5 h-5" />}
                  {type === 'video' && <Video className="w-5 h-5" />}
                  <span className="font-medium capitalize">{type === 'gallery' ? 'Galerie' : type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                placeholder="Titre de la publication"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Résumé (Affiché sur la carte)</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none h-24 resize-none"
              placeholder="Un court résumé..."
            />
          </div>

          {/* Cover Image */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700">Image de couverture</label>
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={() => setFormData({ ...formData, coverImageFit: 'cover' })}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${formData.coverImageFit === 'cover' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  REMPLIR (Cover)
                </button>
                <button 
                  onClick={() => setFormData({ ...formData, coverImageFit: 'contain' })}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${formData.coverImageFit === 'contain' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                >
                  ENTIER (Contain)
                </button>
              </div>
            </div>
            <div 
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden h-48"
              onClick={() => fileInputRef.current?.click()}
            >
              {formData.coverImage ? (
                <img 
                  src={content[formData.coverImage] || formData.coverImage} 
                  alt="Cover" 
                  className={`absolute inset-0 w-full h-full ${formData.coverImageFit === 'contain' ? 'object-contain bg-slate-100' : 'object-cover'}`} 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Cliquez pour ajouter une image</span>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => handleImageUpload(e, 'coverImage')} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Dynamic Fields based on Type */}
          {formData.type === 'article' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Contenu de l'article</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none h-48 resize-y"
                placeholder="Rédigez votre article ici..."
              />
            </div>
          )}

          {formData.type === 'gallery' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Images de la galerie</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {formData.galleryImages?.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={content[img] || img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium">Ajouter</span>
                </button>
              </div>
              <input 
                type="file" 
                ref={galleryInputRef} 
                onChange={(e) => handleImageUpload(e, 'galleryImages')} 
                accept="image/*" 
                multiple
                className="hidden" 
              />
            </div>
          )}

          {formData.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Lien de la vidéo (YouTube, Vimeo, etc.)</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="featured" 
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-accent rounded border-slate-300 focus:ring-accent"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700">
              Mettre en avant (Afficher dans le carrousel)
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Annuler
          </button>
          <button 
            onClick={handleSave}
            disabled={!formData.title || isUploading}
            className="px-6 py-2 rounded-full font-medium bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
