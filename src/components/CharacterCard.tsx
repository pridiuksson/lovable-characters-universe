
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
      className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl group ${className}`}
      onClick={handleCardClick}
      style={{ aspectRatio: '3/4', minWidth: '280px', height: '400px' }}
    >
      {/* Character Image */}
      <div className="relative w-full h-full">
        <img
          src={character.image_url}
          alt={`Character ${character.id}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            console.error('Image failed to load:', character.image_url);
            e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
          }}
        />
        
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Goal text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white text-lg font-medium leading-relaxed">
            {character.goal}
          </p>
        </div>
        
        {/* Subtle hover effect overlay */}
        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  );
};

export default CharacterCard;
