import { Card } from "@/types/Card";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, ArrowLeft, Send, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface CharacterCardProps {
  character: Card;
  className?: string;
}

const CharacterCard = ({ character, className = "" }: CharacterCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, isCharacterIntro?: boolean}>>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    console.log('Card clicked, flipping to chat interface');
    setIsAnimating(true);
    setIsFlipped(true);
    
    // Initialize chat with character introduction
    const introMessage = {
      text: character.description || character.goal,
      isUser: false,
      isCharacterIntro: true
    };
    setMessages([introMessage]);
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleBackClick = () => {
    setIsAnimating(true);
    setIsFlipped(false);
    setMessages([]);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 800);
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    setMousePosition({
      x: (x - centerX) / centerX,
      y: (y - centerY) / centerY
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

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

  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg) scale(${isHovered ? 1.05 : 1})`,
    transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out',
  };

  const shineStyle = {
    background: `linear-gradient(
      ${mousePosition.x * 90 + 45}deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 200, 150, 0.15) 30%,
      rgba(255, 150, 200, 0.1) 40%,
      rgba(150, 200, 255, 0.15) 50%,
      rgba(200, 255, 150, 0.1) 60%,
      rgba(255, 255, 255, 0.1) 80%,
      transparent 100%
    )`,
    transform: `translateX(${mousePosition.x * 20}px) translateY(${mousePosition.y * 20}px)`,
    transition: 'all 0.3s ease-out',
  };

  return (
    <>
      {/* Enhanced card when not flipped */}
      {!isFlipped && (
        <div 
          className={`relative group ${className}`}
          style={{ width: '320px', height: '480px' }}
        >
          <div 
            ref={cardRef}
            className={`w-full h-full cursor-pointer transition-all duration-700 ${isAnimating ? 'animate-scale-out opacity-0' : ''}`}
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
          >
            {/* Outer glow container */}
            <div className={`absolute inset-0 rounded-3xl transition-all duration-500 ${isHovered ? 'blur-xl opacity-20' : 'blur-lg opacity-0'}`} 
                 style={{
                   background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))',
                   transform: 'scale(1.1)',
                 }} 
            />
            
            {/* Main card container */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              {/* Complex holographic background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-zinc-50/80 to-zinc-100/90" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 via-blue-50/40 to-violet-100/30" />
              <div className="absolute inset-0 bg-gradient-to-bl from-pink-100/20 via-transparent to-cyan-100/20" />
              
              {/* Dynamic shine layer */}
              <div 
                className="absolute inset-0 opacity-60"
                style={shineStyle}
              />
              
              {/* Metallic glare layer */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-80"
                style={{
                  transform: `translateX(${mousePosition.x * -15}px) translateY(${mousePosition.y * -15}px)`,
                  transition: 'transform 0.2s ease-out',
                }}
              />
              
              {/* Content container */}
              <div className="relative w-full h-full p-6 flex flex-col">
                {/* Character image */}
                <div className="relative flex-1 rounded-2xl overflow-hidden mb-6">
                  <img
                    src={character.image_url}
                    alt={`Character ${character.id}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Image failed to load:', character.image_url);
                      e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop`;
                    }}
                  />
                  
                  {/* Image overlay gradients */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                </div>
                
                {/* Goal text with vertical gradient */}
                <div className="relative">
                  <p 
                    className="text-sm font-light leading-relaxed line-clamp-3 bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-600 bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom, #27272a 0%, #3f3f46 50%, #52525b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {character.goal}
                  </p>
                </div>
              </div>
              
              {/* Chat indicator */}
              <div className={`absolute bottom-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full transition-all duration-500 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0'} flex items-center justify-center border border-white/30 shadow-lg`}>
                <MessageCircle size={16} className="text-zinc-600" />
              </div>
              
              {/* Subtle inner border */}
              <div className="absolute inset-0 rounded-3xl border border-white/30 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Redesigned chat interface */}
      {isFlipped && (
        <div className={`fixed inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center transition-all duration-700 ${isAnimating ? 'animate-fade-in' : ''}`}>
          <div 
            ref={chatContainerRef}
            className={`w-full max-w-2xl h-full max-h-[85vh] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-3xl border border-white/30 flex flex-col overflow-hidden transition-all duration-700 ${isAnimating ? 'animate-scale-in' : ''}`}
          >
            
            {/* Minimal header */}
            <div className="relative px-6 py-4 bg-white/40 backdrop-blur-xl border-b border-white/20 flex justify-between items-center">
              <Button
                onClick={handleBackClick}
                className="w-9 h-9 p-0 bg-white/60 hover:bg-white/80 border-0 text-zinc-400 hover:text-zinc-600 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft size={14} />
              </Button>

              <div className="text-xs font-light text-zinc-500 tracking-wider uppercase">
                Character #{character.id}
              </div>

              <Button
                onClick={handleShareClick}
                className="w-9 h-9 p-0 bg-white/60 hover:bg-white/80 border-0 text-zinc-400 hover:text-zinc-600 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <Share size={14} />
              </Button>
            </div>

            {/* Progress bar with metallic appearance */}
            <div className="px-6 py-1 bg-white/20 backdrop-blur-xl">
              <Progress 
                value={progress} 
                className="h-0.5 bg-gradient-to-r from-zinc-200/50 to-zinc-300/50"
              />
            </div>

            {/* Chat messages area */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="px-6 py-6 space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {msg.isCharacterIntro ? (
                      // Character introduction message with image
                      <div className="max-w-[85%] space-y-4">
                        <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm border border-white/40 rounded-3xl">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 flex-shrink-0">
                            <img
                              src={character.image_url}
                              alt={`Character ${character.id}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop`;
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-3">
                            {character.description && (
                              <p className="text-base font-light text-zinc-800 leading-relaxed">
                                {character.description}
                              </p>
                            )}
                            <Separator className="bg-zinc-200/60" />
                            <div>
                              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider block mb-2">Goal</span>
                              <p className="text-sm font-light text-zinc-700 leading-relaxed">
                                {character.goal}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular message bubbles
                      <div className={`max-w-[75%] transition-all duration-300 ${
                        msg.isUser 
                          ? 'bg-zinc-900 text-white rounded-3xl px-6 py-4' 
                          : 'bg-white/80 backdrop-blur-sm border border-white/40 text-zinc-700 rounded-3xl px-6 py-4'
                      }`}>
                        <p className="text-sm font-light leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Input area */}
            <div className="px-6 py-5 bg-white/40 backdrop-blur-xl border-t border-white/20">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Your message..."
                    className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl text-sm font-light text-zinc-700 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-white/60 transition-all duration-300"
                    rows={1}
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="w-12 h-12 p-0 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-300 disabled:opacity-50 text-white rounded-3xl transition-all duration-300 flex items-center justify-center border-0"
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
