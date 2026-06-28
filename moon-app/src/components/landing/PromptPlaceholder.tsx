'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Image as ImageIcon } from 'lucide-react';

interface PromptPlaceholderProps {
  id: number;
  width: number;
  height: number;
  ratio: string;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
}

export function PromptPlaceholder({
  id,
  width,
  height,
  ratio,
  className = '',
  imageClassName = '',
  objectPosition = 'center',
}: PromptPlaceholderProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if image is already loaded (from cache or quick load)
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setImgLoaded(true);
    }
  }, [id]);

  const handleCopyPath = () => {
    // Copy the relative path to the prompt markdown file
    const promptPath = `.agents/docs/26-06-28/image_prompts/${id}.md`;
    navigator.clipboard.writeText(promptPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative group border border-dashed border-paperGray bg-paperCream/50 hover:bg-paperCream transition-all duration-300 flex flex-col items-center justify-center p-6 text-center rounded-sm overflow-hidden select-none ${className}`} 
      style={{ aspectRatio: ratio.replace(':', '/') }}
    >
      {/* Dynamic Image Overlay */}
      {!imgError && (
        <img 
          ref={imgRef}
          src={`/images/landing/${id}.png`} 
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          alt={`Visual ${id}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out z-20 ${
            imgLoaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } ${imageClassName}`}
          style={{ objectPosition }}
        />
      )}

      {/* Background blueprint pattern grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#121212_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-brandOrange/40 pointer-events-none"></div>
      <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-brandOrange/40 pointer-events-none"></div>
      <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-brandOrange/40 pointer-events-none"></div>
      <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-brandOrange/40 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center gap-2 max-w-full">
        <div className="p-3 bg-brandOrange/10 rounded-full text-brandOrange mb-1 group-hover:scale-110 transition-transform duration-300">
          <ImageIcon size={28} strokeWidth={1.5} />
        </div>
        
        <span className="text-[11px] font-mono tracking-wider text-brandRed font-semibold bg-brandRed/10 px-2.5 py-0.5 rounded-full">
          IMAGE PLACEHOLDER #{id}
        </span>
        
        <span className="text-xs font-mono text-paperDark/60 font-semibold mt-1">
          {width}px × {height}px | Aspect {ratio}
        </span>
        
        <p className="mt-2.5 text-xs text-paperDark/50 px-4 max-w-md italic font-fraunces leading-relaxed">
          Place <code className="bg-paperDark/10 px-1 py-0.5 rounded font-mono text-[10px] not-italic">{id}.png</code> inside the <code className="bg-paperDark/10 px-1 py-0.5 rounded font-mono text-[10px] not-italic">public/images/landing/</code> folder.
        </p>
        
        <button 
          onClick={handleCopyPath}
          className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-paperDark text-paperCream text-xs font-oswald tracking-wider uppercase rounded hover:bg-brandRed active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span>Path Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy Prompt File Path</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
