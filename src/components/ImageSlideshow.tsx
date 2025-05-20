
"use client";

import type { FC } from 'react';
import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideImage {
  src: string;
  alt: string;
  hint: string;
}

interface ImageSlideshowProps {
  images: SlideImage[];
  title?: string;
}

export const ImageSlideshow: FC<ImageSlideshowProps> = ({ images, title }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Scroll by roughly one item width, considering padding/margins if any
      // For simplicity, let's scroll by 80% of the container's visible width
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="py-6 sm:py-8">
      {title && <h2 className="text-2xl font-semibold mb-4 px-4 sm:px-0 text-foreground">{title}</h2>}
      <div className="relative group">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/70 hover:bg-background/90 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-4 py-4 px-1 scrollbar-hide snap-x snap-mandatory"
          aria-roledescription="carousel"
          aria-label={title || "Image slideshow"}
        >
          {images.map((image, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-60 h-40 sm:w-72 sm:h-48 md:w-80 md:h-56 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 snap-center bg-muted"
              role="group"
              aria-roledescription="slide"
              aria-label={`${image.alt} - slide ${index + 1} of ${images.length}`}
              >
              <Image
                src={image.src}
                alt={image.alt}
                width={320} 
                height={224} 
                className="w-full h-full object-cover"
                data-ai-hint={image.hint}
                priority={index < 3} // Prioritize loading for the first few images
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/70 hover:bg-background/90 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 focus:opacity-100"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
