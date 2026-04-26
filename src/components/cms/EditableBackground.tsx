import React, { useRef } from 'react';
import { useCMS } from '../../context/CMSContext';
import { ImagePlus } from 'lucide-react';

export default function EditableBackground({ 
  contentKey, 
  className = "", 
  children 
}: { 
  contentKey: string, 
  className?: string, 
  children: React.ReactNode 
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
          const MAX_DIMENSION = 1920;
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
    <div 
      className={`relative bg-fixed bg-center bg-cover ${className}`}
      style={{ backgroundImage: `url(${content[contentKey]})` }}
    >
      {isEditing && (
        <div 
          className="absolute top-4 left-4 z-50 bg-black/60 p-3 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-black/80 transition-colors shadow-lg border border-white/20"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">Modifier le fond (Parallax)</span>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      )}
      {children}
    </div>
  );
}
