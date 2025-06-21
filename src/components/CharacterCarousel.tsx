
import { Card } from "@/types/Card";
import CharacterCard from "./CharacterCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CharacterCarouselProps {
  characters: Card[];
}

const CharacterCarousel = ({ characters }: CharacterCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}
      </style>
      <div className="relative">
        {/* Navigation buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>

        {/* Carousel container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-12"
        >
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CharacterCarousel;
