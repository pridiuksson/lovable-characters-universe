
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/types/Card";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const fetchCharacters = async (): Promise<Card[]> => {
  const response = await fetch('/api/characters');
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Character Not Found</h1>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Characters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="mb-6 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Characters
          </Button>
        </div>

        {/* Character display */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Character image */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: '3/4' }}>
                <img
                  src={character.image_url}
                  alt={`Character ${character.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-lg font-medium leading-relaxed">
                    {character.goal}
                  </p>
                </div>
              </div>
            </div>

            {/* Character details and actions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-white mb-4">
                  Character #{character.id}
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {character.goal}
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-6 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Role-Play Adventure
                </Button>
                
                <p className="text-sm text-gray-400 text-center">
                  Begin your interactive story with this character
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
