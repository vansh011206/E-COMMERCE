import React, { useState, useRef, memo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images, name }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  // Reset selected image when images array changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  // Handle in-place zoom
  const handleMouseMove = (e) => {
    if (!imageRef.current || !containerRef.current || isFullscreen) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isFullscreen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 h-full">
        {/* Desktop Thumbnails */}
        <div className="hidden md:flex flex-col gap-2 w-[72px] flex-shrink-0 max-h-[85vh] overflow-y-auto hide-scrollbar pb-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-[72px] h-[90px] rounded-md overflow-hidden bg-[#F8F8F6] flex-shrink-0 transition-all duration-200 ${
                selectedIndex === i
                  ? 'border-2 border-[#0A0A0A]'
                  : 'border-[1.5px] border-transparent hover:border-[#CCC]'
              }`}
            >
              <img src={img} alt={`${name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main Image Container */}
        <div 
          ref={containerRef}
          className="relative flex-1 aspect-[3/4] md:aspect-auto md:h-[85vh] bg-[#F8F8F6] rounded-lg overflow-hidden group cursor-crosshair"
          onMouseMove={handleMouseMove}
          onClick={() => setIsFullscreen(true)}
        >
          <img
            ref={imageRef}
            src={images[selectedIndex]}
            alt={name}
            className="w-full h-full object-cover object-top transition-transform duration-200 ease-out group-hover:scale-[2]"
            style={{ transformOrigin: 'center center' }}
          />
          
          {/* Mobile swipe hint overlay (hidden on desktop) */}
          <div className="md:hidden absolute inset-0 bg-black/5 flex items-center justify-between px-2 pointer-events-none">
            <button onClick={handlePrev} className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center pointer-events-auto shadow-sm backdrop-blur-sm">
              <ChevronLeft size={18} className="text-black" />
            </button>
            <button onClick={handleNext} className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center pointer-events-auto shadow-sm backdrop-blur-sm">
              <ChevronRight size={18} className="text-black" />
            </button>
          </div>

          {/* Mobile Dot Indicators */}
          <div className="md:hidden absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  selectedIndex === i ? 'bg-[#0A0A0A] w-3' : 'bg-[#0A0A0A]/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Viewer Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
          >
            <button 
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-10"
            >
              <X size={32} />
            </button>

            <button onClick={handlePrev} className="absolute left-6 text-white/50 hover:text-white transition-colors p-4 z-10 hidden md:block">
              <ChevronLeft size={48} strokeWidth={1} />
            </button>

            <motion.div 
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full md:w-[80vw] md:h-[85vh] flex items-center justify-center px-4 md:px-0"
              onClick={() => setIsFullscreen(false)} // Close on background click
            >
              <img 
                src={images[selectedIndex]} 
                alt={name} 
                className="max-w-full max-h-full object-contain select-none"
                onClick={(e) => e.stopPropagation()} // Prevent close on image click
              />
            </motion.div>

            <button onClick={handleNext} className="absolute right-6 text-white/50 hover:text-white transition-colors p-4 z-10 hidden md:block">
              <ChevronRight size={48} strokeWidth={1} />
            </button>

            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-4 text-white/70 font-mono text-[13px]">
              <span>{selectedIndex + 1} / {images.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(ProductGallery);
