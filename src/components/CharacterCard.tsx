
import { Card } from "@/types/Card";
import { useNavigate } from "react-router-dom";

interface CharacterCardProps {
  character: Card;
  className?: string;
}

const CharacterCard = ({ character, className = "" }: CharacterCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('Card clicked, navigating to:', `/play/${character.id}`);
    navigate(`/play/${character.id}`);
  };

  return (
    <div 
      className={`relative cursor-pointer group ${className}`}
      onClick={handleCardClick}
      style={{ width: '320px', height: '480px' }}
    >
      {/* Luminous card container */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 rounded-3xl shadow-2xl transition-all duration-700 group-hover:shadow-3xl group-hover:scale-[1.02] border border-zinc-200/50">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-50/20 to-violet-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* Character image with sophisticated masking */}
        <div className="relative w-full h-full p-4">
          <div className="relative w-full h-4/5 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
            <img
              src={character.image_url}
              alt={`Character ${character.id}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                console.error('Image failed to load:', character.image_url);
                e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
              }}
            />
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Premium reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-60" />
          </div>
          
          {/* Minimalist text area */}
          <div className="mt-4 px-2">
            <p className="text-zinc-700 text-sm font-light leading-relaxed line-clamp-3 transition-colors duration-300 group-hover:text-zinc-900">
              {character.goal}
            </p>
          </div>
        </div>
        
        {/* Subtle interaction indicator */}
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-zinc-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:bg-zinc-500" />
      </div>
    </div>
  );
};

export default CharacterCard;
