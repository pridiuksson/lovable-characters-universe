
import { Card } from "@/types/Card";
import { useState } from "react";
import { MessageCircle, ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CharacterCardProps {
  character: Card;
  className?: string;
}

const CharacterCard = ({ character, className = "" }: CharacterCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);

  const handleCardClick = () => {
    console.log('Card clicked, flipping to chat interface');
    setIsFlipped(true);
  };

  const handleBackClick = () => {
    setIsFlipped(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { text: message, isUser: true }]);
      // Simulate character response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I understand your message. Let me help you with that goal.", isUser: false }]);
      }, 1000);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Regular card when not flipped */}
      {!isFlipped && (
        <div 
          className={`relative group ${className}`}
          style={{ width: '320px', height: '480px' }}
        >
          <div 
            className="w-full h-full cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 rounded-3xl shadow-2xl transition-all duration-700 group-hover:shadow-3xl group-hover:scale-[1.02] border border-zinc-200/50">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/20 via-blue-50/20 to-violet-100/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Character image */}
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
              
              {/* Chat indicator */}
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center border border-zinc-200/50">
                <MessageCircle size={14} className="text-zinc-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen chat interface when flipped */}
      {isFlipped && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-4xl h-full max-h-[90vh] bg-gradient-to-br from-white via-zinc-50 to-zinc-100 rounded-3xl shadow-3xl border border-zinc-200/50 flex flex-col overflow-hidden animate-scale-in">
            {/* Minimalist header */}
            <div className="p-8 border-b border-zinc-200/30 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={handleBackClick}
                  className="w-10 h-10 p-0 bg-white/80 hover:bg-white border border-zinc-200/50 text-zinc-600 hover:text-zinc-800 rounded-full transition-all duration-300 hover:scale-105"
                >
                  <ArrowLeft size={16} />
                </Button>
                <div className="text-center">
                  <h3 className="text-2xl font-extralight text-zinc-900 tracking-tight">Character #{character.id}</h3>
                </div>
                <div className="w-10 h-10" />
              </div>
              
              {/* Elegant goal display */}
              <div className="bg-gradient-to-r from-purple-50/50 to-blue-50/50 rounded-3xl p-6 border border-zinc-200/30">
                <p className="text-xs font-light text-zinc-500 uppercase tracking-wider mb-2">Current Goal</p>
                <p className="text-lg font-light text-zinc-700 leading-relaxed">{character.goal}</p>
              </div>
            </div>

            {/* Spacious messages area */}
            <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-16">
                    <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-white/60 to-zinc-100/60 border border-zinc-200/50">
                      <div className="w-16 h-16 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <MessageCircle size={20} className="text-zinc-500" />
                      </div>
                      <p className="text-lg font-light text-zinc-600 mb-2">Begin your conversation</p>
                      <p className="text-sm font-light text-zinc-400">Share your thoughts, ask questions, or discuss your goals</p>
                    </div>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-6 rounded-3xl ${
                      msg.isUser 
                        ? 'bg-zinc-900 text-white' 
                        : 'bg-white/80 backdrop-blur-sm border border-zinc-200/50 text-zinc-700'
                    } transition-all duration-300 hover:scale-[1.02]`}>
                      <p className="text-base font-light leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Refined input area */}
            <div className="p-8 border-t border-zinc-200/30 bg-white/60 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-4 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share your thoughts..."
                      className="w-full p-6 pr-16 bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-3xl text-base font-light text-zinc-700 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:border-transparent transition-all duration-300"
                      rows={1}
                      style={{ minHeight: '64px', maxHeight: '120px' }}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-16 h-16 p-0 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:opacity-50 text-white rounded-3xl transition-all duration-300 flex items-center justify-center hover:scale-105"
                  >
                    <Send size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterCard;
