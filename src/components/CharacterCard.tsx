
import { Card } from "@/types/Card";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, ArrowLeft, Send, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CharacterCardProps {
  character: Card;
  className?: string;
}

const CharacterCard = ({ character, className = "" }: CharacterCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, isCharacterIntro?: boolean}>>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    console.log('Card clicked, flipping to chat interface');
    setIsFlipped(true);
    
    // Initialize chat with character introduction
    const introMessage = {
      text: character.description || character.goal,
      isUser: false,
      isCharacterIntro: true
    };
    setMessages([introMessage]);
  };

  const handleBackClick = () => {
    setIsFlipped(false);
    setMessages([]);
    setProgress(0);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { text: message, isUser: true }]);
      setProgress(prev => Math.min(prev + 10, 100));
      setTimeout(() => {
        setMessages(prev => [...prev, { text: "I understand your message. Let me help you with that goal.", isUser: false }]);
        setProgress(prev => Math.min(prev + 5, 100));
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

  const handleShareClick = () => {
    const uniqueURL = `${window.location.origin}/play/${character.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Character #${character.id}`,
        text: `Check out this amazing character conversation: ${character.goal}`,
        url: uniqueURL,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(uniqueURL).then(() => {
        console.log('Character URL copied to clipboard');
      }).catch(() => {
        console.log('Failed to copy URL');
      });
    }
  };

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isFlipped && chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        handleBackClick();
      }
    };

    if (isFlipped) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFlipped]);

  return (
    <>
      {/* Simplified card when not flipped */}
      {!isFlipped && (
        <div 
          className={`relative group ${className}`}
          style={{ width: '320px', height: '480px' }}
        >
          <div 
            ref={cardRef}
            className="w-full h-full cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={handleCardClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Main card container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              {/* Character image - now full card */}
              <div className="absolute inset-0">
                <img
                  src={character.image_url}
                  alt={`Character ${character.id}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    console.error('Image failed to load:', character.image_url);
                    e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
                  }}
                />
              </div>
              
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Goal text overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-sm font-light leading-relaxed line-clamp-3 drop-shadow-lg">
                  {character.goal}
                </p>
              </div>
              
              {/* Chat indicator */}
              <div className={`absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0'} flex items-center justify-center border border-white/30 shadow-lg`}>
                <MessageCircle size={16} className="text-zinc-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat interface */}
      {isFlipped && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur flex items-center justify-center">
          <div 
            ref={chatContainerRef}
            className="w-full max-w-5xl h-full max-h-[95vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl border border-white/20 flex flex-col overflow-hidden"
          >
            
            {/* Clean header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <Button
                onClick={handleBackClick}
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
              >
                <ArrowLeft size={16} />
              </Button>

              <div className="text-xs font-medium text-zinc-400 tracking-wider uppercase">
                Character #{character.id}
              </div>

              <Button
                onClick={handleShareClick}
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0"
              >
                <Share size={16} />
              </Button>
            </div>

            {/* Metallic progress bar */}
            <div className="px-6">
              <Progress 
                value={progress} 
                className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200"
              />
            </div>

            {/* Chat messages area with ScrollArea */}
            <ScrollArea className="flex-1 px-6 py-6">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {msg.isCharacterIntro ? (
                      <div className="flex items-start gap-6 max-w-full">
                        <Avatar className="w-24 h-24 flex-shrink-0 ring-2 ring-zinc-200">
                          <AvatarImage
                            src={character.image_url}
                            alt={`Character ${character.id}`}
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop`;
                            }}
                          />
                        </Avatar>
                        <div className="flex-1 space-y-4">
                          {character.description && (
                            <p className="text-lg text-zinc-700 leading-relaxed">
                              {character.description}
                            </p>
                          )}
                          <Separator className="bg-zinc-200" />
                          <div>
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-3">Goal</span>
                            <p className="text-base text-zinc-600 leading-relaxed">
                              {character.goal}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-[75%] px-4 py-3 rounded-2xl transition-all duration-200 ${
                        msg.isUser 
                          ? 'bg-zinc-900 text-white ml-4' 
                          : 'bg-zinc-100 text-zinc-700 mr-4'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="p-6 border-t border-zinc-100">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm text-zinc-700 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition-all duration-200"
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="sm"
                  className="rounded-full h-12 w-12 p-0"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterCard;
