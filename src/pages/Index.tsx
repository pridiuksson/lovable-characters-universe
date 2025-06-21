
import { useQuery } from "@tanstack/react-query";
import CharacterCarousel from "@/components/CharacterCarousel";
import { Card } from "@/types/Card";

const fetchCharacters = async (): Promise<Card[]> => {
  const response = await fetch('https://yevyfxmmijukjohbdjwv.supabase.co/functions/v1/get-public-cards');
  if (!response.ok) {
    throw new Error('Failed to fetch characters');
  }
  return response.json();
};

const Index = () => {
  const { data: characters, isLoading, error } = useQuery({
    queryKey: ['characters'],
    queryFn: fetchCharacters,
  });

  console.log('Characters data:', characters);
  console.log('Loading state:', isLoading);
  console.log('Error state:', error);

  if (error) {
    console.error('Error fetching characters:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white relative overflow-hidden">
      {/* Ambient light effects */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-100/30 via-transparent to-transparent opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-100/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto px-8 py-16">
        {/* Minimalist header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block">
            <h1 className="text-6xl font-extralight text-zinc-900 mb-6 tracking-tight leading-none">
              Character
              <span className="block text-5xl font-thin text-zinc-600 mt-2">Universe</span>
            </h1>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-8" />
            <p className="text-lg font-light text-zinc-500 max-w-md mx-auto leading-relaxed">
              Where stories begin and imagination takes flight
            </p>
          </div>
        </div>

        {/* Content area */}
        <div className="mb-24">
          {isLoading && (
            <div className="flex justify-center items-center py-32">
              <div className="relative">
                <div className="w-16 h-16 border-2 border-zinc-200 rounded-full animate-spin">
                  <div className="absolute top-0 left-0 w-4 h-4 bg-zinc-400 rounded-full animate-pulse" />
                </div>
                <p className="text-zinc-400 text-sm font-light mt-6 text-center">Loading characters</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-32 animate-fade-in">
              <div className="inline-block p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-zinc-200/50 shadow-xl">
                <p className="text-zinc-600 text-lg font-light mb-2">Unable to connect</p>
                <p className="text-zinc-400 text-sm font-light">Please check your connection and try again</p>
              </div>
            </div>
          )}
          
          {characters && characters.length > 0 && (
            <div className="animate-fade-in delay-300">
              <CharacterCarousel characters={characters} />
            </div>
          )}
          
          {characters && characters.length === 0 && (
            <div className="text-center py-32 animate-fade-in">
              <div className="inline-block p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-zinc-200/50 shadow-xl">
                <p className="text-zinc-500 text-lg font-light">No characters discovered yet</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
