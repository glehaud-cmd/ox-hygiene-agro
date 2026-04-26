import React, { useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ImagePlus } from 'lucide-react';

export default function EditableImage({ 
  contentKey, 
  className = "", 
  imgClassName = "w-full h-full object-cover",
  alt = "" 
}: { 
  contentKey: string, 
  className?: string, 
  imgClassName?: string,
  alt?: string 
}) {
  const { content, isEditing, updateContent } = useCMS();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimension
          const MAX_DIMENSION = 1200;
          if (width > height && width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Compress to JPEG with 0.7 quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            updateContent(contentKey, compressedBase64);
          } else {
            updateContent(contentKey, reader.result as string);
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {content[contentKey] ? (
        <img 
          src={content[contentKey]} 
          alt={alt} 
          className={imgClassName} 
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2068&auto=format&fit=crop"; // Generic agro fallback
            target.onerror = null; // Prevent infinite loop
          }}
        />
      ) : (
        <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${imgClassName}`}>
          <ImagePlus className="w-8 h-8" />
        </div>
      )}
      {isEditing && (
        <div 
          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="w-10 h-10 text-white mb-2" />
          <span className="text-white font-medium text-center px-2">Modifier l'image</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      )}
    </div>
  );
}
