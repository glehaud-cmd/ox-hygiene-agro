import React from 'react';
import { motion } from 'motion/react';
import EditableText from '../components/cms/EditableText';
import EditableImage from '../components/cms/EditableImage';
import DynamicGallery from '../components/cms/DynamicGallery';

export default function GenericPage({ pageKey, defaultTitle }: { pageKey: string, defaultTitle: string }) {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="h-64 sm:h-80 relative">
            <EditableImage 
              contentKey={`${pageKey}_hero_img`} 
              className="w-full h-full" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-white text-center px-4">
                <EditableText contentKey={`${pageKey}_title`} />
              </h1>
            </div>
          </div>
          
          <div className="p-8 sm:p-12">
            <div className="prose prose-lg max-w-none text-slate-600 prose-table:border prose-table:border-slate-200 prose-th:bg-slate-50 prose-th:p-4 prose-td:p-4 prose-th:text-primary prose-th:font-bold prose-td:border prose-td:border-slate-100">
              <div className="markdown-content">
                <EditableText contentKey={`${pageKey}_content`} multiline renderAsMarkdown />
              </div>

              {/* Dynamic Gallery Section */}
              <DynamicGallery 
                contentKey={`${pageKey}_gallery_list`} 
                title="Galerie Photos" 
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
