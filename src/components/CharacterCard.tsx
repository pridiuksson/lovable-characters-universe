
import { Card } from "@/types/Card";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const cardRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();

  // Memoized styles for better performance
  const cardStyles = useMemo(() => ({
    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: isHovered ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)',
  }), [tilt.x, tilt.y, isHovered]);

  const gradientStyles = useMemo(() => ({
    background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 + tilt.x * 2}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
  }), [tilt.x, tilt.y]);

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    mouseRef.current = { x, y };
    
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (mouseRef.current.y - centerY) / 20;
      const rotateY = (centerX - mouseRef.current.x) / 20;
      
      setTilt({ x: rotateX, y: rotateY });
      rafRef.current = undefined;
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
  }, []);

  const handleCardClick = useCallback(() => {
    console.log('Card clicked, flipping to chat interface');
    setIsFlipped(true);
    
    const introMessage = {
      text: character.description || character.goal,
      isUser: false,
      isCharacterIntro: true
    };
    setMessages([introMessage]);
  }, [character.description, character.goal]);

  const handleBackClick = useCallback(() => {
    setIsFlipped(false);
    setMessages([]);
    setProgress(0);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setProgress(prev => Math.min(prev + 10, 100));
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "I understand your message. Let me help you with that goal.", isUser: false }]);
      setProgress(prev => Math.min(prev + 5, 100));
    }, 1000);
    
    setMessage("");
  }, [message]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleShareClick = useCallback(() => {
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
  }, [character.id, character.goal]);

  // Optimized click outside handler
  useEffect(() => {
    if (!isFlipped) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target as Node)) {
        handleBackClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isFlipped, handleBackClick]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Card front */}
      {!isFlipped && (
        <div 
          className={`relative group ${className}`}
          style={{ width: '320px', height: '480px' }}
        >
          <div 
            ref={cardRef}
            className="w-full h-full cursor-pointer"
            style={cardStyles}
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              {/* Character image */}
              <div className="absolute inset-0">
                <img
                  src={character.image_url}
                  alt={`Character ${character.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', character.image_url);
                    e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
                  }}
                />
              </div>
              
              {/* Dynamic gradient overlay */}
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={gradientStyles}
              />
              
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Floating particles */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/3 left-1/5 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
              </div>
              
              {/* Goal text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-sm font-light leading-relaxed line-clamp-3 drop-shadow-lg">
                  {character.goal}
                </p>
              </div>
              
              {/* Chat indicator */}
              <div className={`absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full transition-all duration-500 ${isHovered ? 'opacity-100 scale-110 rotate-12' : 'opacity-0'} flex items-center justify-center border border-white/30 shadow-lg`}>
                <MessageCircle size={16} className="text-zinc-700" />
              </div>
              
              {/* Shimmer effect */}
              <div className={`absolute inset-0 transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat interface */}
      {isFlipped && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div 
            ref={chatContainerRef}
            className="w-full max-w-6xl h-full max-h-[90vh] bg-white/95 backdrop-blur-xl rounded-3xl shadow-3xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <Button
                onClick={handleBackClick}
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0 hover:bg-zinc-100"
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
                className="rounded-full h-8 w-8 p-0 hover:bg-zinc-100"
              >
                <Share size={16} />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="px-6">
              <Progress 
                value={progress} 
                className="h-px bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200"
              />
            </div>

            {/* Chat messages */}
            <ScrollArea className="flex-1 px-6 py-6">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {msg.isCharacterIntro ? (
                      <div className="flex items-start gap-8 max-w-full">
                        <Avatar className="w-32 h-32 flex-shrink-0 ring-4 ring-zinc-200 shadow-lg">
                          <AvatarImage
                            src={character.image_url}
                            alt={`Character ${character.id}`}
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop`;
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
