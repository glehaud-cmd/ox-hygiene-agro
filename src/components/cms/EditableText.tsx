import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useCMS } from '../../context/CMSContext';

export default function EditableText({ 
  contentKey, 
  className = "", 
  as: Component = "span",
  multiline = false,
  renderAsMarkdown = false
}: { 
  contentKey: string, 
  className?: string, 
  as?: any,
  multiline?: boolean,
  renderAsMarkdown?: boolean
}) {
  const { content, isEditing, updateContent } = useCMS();

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    let newText = e.currentTarget.innerText;
    if (!multiline) {
      newText = newText.replace(/\n/g, ' ');
    }
    updateContent(contentKey, newText);
  };

  const textValue = content[contentKey] || `[${contentKey}]`;

  if (renderAsMarkdown && !isEditing) {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {textValue}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <Component
      contentEditable={isEditing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      className={`${className} ${isEditing ? 'border-2 border-dashed border-blue-500 bg-blue-50/50 cursor-text min-w-[20px] inline-block p-1 rounded transition-all' : ''}`}
    >
      {textValue}
    </Component>
  );
}
