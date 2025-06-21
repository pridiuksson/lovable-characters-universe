
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/types/Card";
import { ArrowLeft, Play as PlayIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-zinc-200 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-4 h-4 bg-zinc-400 rounded-full animate-pulse" />
          </div>
          <p className="text-zinc-400 text-sm font-light mt-6 text-center">Loading character</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-block p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-zinc-200/50 shadow-xl">
            <h1 className="text-2xl font-light text-zinc-700 mb-6">Character not found</h1>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-light px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="mr-3 h-4 w-4" />
              Return to characters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white relative overflow-hidden">
      {/* Ambient lighting */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-100/20 via-transparent to-transparent opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-100/15 rounded-full blur-3xl animate-pulse" />
      
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Minimalist navigation */}
        <div className="mb-12 animate-fade-in">
          <Button 
            onClick={() => navigate('/')} 
            className="bg-white/80 hover:bg-white border border-zinc-200/50 text-zinc-700 hover:text-zinc-900 font-light px-6 py-3 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
          >
            <ArrowLeft className="mr-3 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Premium character showcase */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Luminous character display */}
            <div className="relative animate-fade-in delay-200">
              <div className="relative bg-gradient-to-br from-white via-zinc-50 to-zinc-100 rounded-3xl overflow-hidden shadow-3xl border border-zinc-200/50" style={{ aspectRatio: '3/4' }}>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-blue-50/20 to-violet-100/30 opacity-60" />
                
                <img
                  src={character.image_url}
                  alt={`Character ${character.id}`}
                  className="relative z-10 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
                  }}
                />
                
                {/* Elegant text overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-8">
                  <p className="text-white text-lg font-light leading-relaxed">
                    {character.goal}
                  </p>
                </div>
                
                {/* Premium reflection */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Sophisticated content area */}
            <div className="space-y-10 animate-fade-in delay-400">
              <div>
                <div className="inline-block mb-4">
                  <span className="text-sm font-light text-zinc-400 tracking-wider uppercase">Character</span>
                  <div className="w-12 h-px bg-zinc-300 mt-2" />
                </div>
                <h1 className="text-5xl font-extralight text-zinc-900 mb-6 tracking-tight">
                  #{character.id}
                </h1>
                <p className="text-xl font-light text-zinc-600 leading-relaxed">
                  {character.goal}
                </p>
              </div>

              <div className="space-y-6">
                <Button 
                  size="lg" 
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-light py-6 text-lg rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                >
                  <PlayIcon className="mr-3 h-5 w-5 transition-transform group-hover:scale-110" />
                  Begin experience
                </Button>
                
                <p className="text-sm font-light text-zinc-400 text-center leading-relaxed">
                  Start your interactive journey with this character
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
