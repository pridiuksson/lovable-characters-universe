
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/types/Card";
import CharacterCard from "@/components/CharacterCard";
import CharacterMetaTags from "@/components/CharacterMetaTags";

const fetchCharacters = async (): Promise<Card[]> => {
  const response = await fetch('https://yevyfxmmijukjohbdjwv.supabase.co/functions/v1/get-public-cards');
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  return response.json();
};

const Play = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: characters, isLoading } = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
  });

  const character = characters?.find(c => c.id === parseInt(id || '0'));

  console.log('Character ID from URL:', id);
  console.log('Found character:', character);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white relative overflow-hidden">
        {/* Ambient light effects - same as Index page */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-100/30 via-transparent to-transparent opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-zinc-200 rounded-full animate-spin">
              <div className="absolute top-0 left-0 w-4 h-4 bg-zinc-400 rounded-full animate-pulse" />
            </div>
            <p className="text-zinc-400 text-sm font-light mt-6 text-center">Loading character</p>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white relative overflow-hidden">
        {/* Ambient light effects - same as Index page */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-100/30 via-transparent to-transparent opacity-60" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center animate-fade-in">
            <div className="inline-block p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-xl">
              <h1 className="text-2xl font-light text-zinc-700 mb-6">Character not found</h1>
              <button 
                onClick={() => navigate('/')} 
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-light px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Return to characters
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white relative overflow-hidden">
      <CharacterMetaTags character={character} />
      {/* Ambient light effects - same as Index page */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-100/30 via-transparent to-transparent opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <CharacterCard character={character} />
      </div>
    </div>
  );
};

export default Play;
