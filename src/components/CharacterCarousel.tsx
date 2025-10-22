
import { Card } from "@/types/Card";
import CharacterCard from "./CharacterCard";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";

interface CharacterCarouselProps {
  characters: Card[];
}

const CharacterCarousel = ({ characters }: CharacterCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Elegant navigation */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full border border-zinc-200/50 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:scale-110 hover:shadow-xl items-center justify-center hidden md:flex"
        aria-label="Previous characters"
      >
        <ChevronLeft size={18} className="text-zinc-600" />
      </button>
      
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full border border-zinc-200/50 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:scale-110 hover:shadow-xl items-center justify-center hidden md:flex"
        aria-label="Next characters"
      >
        <ChevronRight size={18} className="text-zinc-600" />
      </button>

      {/* Character grid with premium spacing */}
      <div
        ref={scrollContainerRef}
        className="flex flex-col md:flex-row gap-4 md:gap-8 overflow-y-auto md:overflow-y-visible md:overflow-x-auto scrollbar-hide pb-6 md:pb-8 px-4 md:px-16 items-center md:items-start"
      >
        {characters.map((character, index) => (
          <div
            key={character.id}
            className="animate-fade-in w-full md:w-auto md:flex-shrink-0"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CharacterCard character={character} />
          </div>
        ))}
      </div>

      {/* Jump to top button - mobile only */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-4 z-50 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full border border-zinc-200/50 shadow-lg md:hidden flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 animate-fade-in"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="text-zinc-600" />
        </button>
      )}
    </div>
  );
};

export default CharacterCarousel;
