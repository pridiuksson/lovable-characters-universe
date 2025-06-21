
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Character Universe
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover extraordinary characters and embark on immersive role-play adventures
          </p>
        </div>

        {/* Featured Characters Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-white mb-8 text-center">
            Featured Characters
          </h2>
          
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">Unable to load characters at the moment</p>
              <p className="text-gray-400 mt-2">Please try again later</p>
            </div>
          )}
          
          {characters && characters.length > 0 && (
            <CharacterCarousel characters={characters} />
          )}
          
          {characters && characters.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No characters available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
