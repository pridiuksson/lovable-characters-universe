
import { Card } from "@/types/Card";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, ArrowLeft, Send, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CharacterCardProps {
  character: Card;
  className?: string;
}

const CharacterCard = ({ character, className = "" }: CharacterCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [progress] = useState(65);
  const [isGoalFlipped, setIsGoalFlipped] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    console.log('Card clicked, flipping to chat interface');
    setIsAnimating(true);
    setIsFlipped(true);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleBackClick = () => {
    setIsAnimating(true);
    setIsFlipped(false);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { text: message, isUser: true }]);
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

  // Handle click outside to close card
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

      {/* Redesigned chat interface with Jony Ive philosophy */}
      {isFlipped && (
        <div className={`fixed inset-0 z-50 bg-black/5 backdrop-blur-sm flex items-center justify-center transition-all duration-700 ${isAnimating ? 'animate-fade-in' : ''}`}>
          <div 
            ref={chatContainerRef}
            className={`w-full max-w-4xl h-full max-h-[90vh] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-3xl border border-white/30 flex flex-col overflow-hidden transition-all duration-700 ${isAnimating ? 'animate-scale-in' : ''}`}
          >
            
            {/* Minimal header with character info */}
            <div className="relative px-8 py-6 bg-white/40 backdrop-blur-xl border-b border-white/20">
              {/* Back Button */}
              <Button
                onClick={handleBackClick}
                className="absolute top-6 left-6 w-10 h-10 p-0 bg-white/60 hover:bg-white/80 border-0 text-zinc-500 hover:text-zinc-700 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <ArrowLeft size={16} />
              </Button>

              {/* Share Button */}
              <Button
                onClick={handleShareClick}
                className="absolute top-6 right-6 w-10 h-10 p-0 bg-white/60 hover:bg-white/80 border-0 text-zinc-500 hover:text-zinc-700 rounded-full transition-all duration-300 backdrop-blur-sm"
              >
                <Share size={16} />
              </Button>

              {/* Centered character info */}
              <div className="text-center">
                <div className="inline-flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200">
                    <img
                      src={character.image_url}
                      alt={`Character ${character.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop`;
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-light text-zinc-800 tracking-tight">
                      Character #{character.id}
                    </h2>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-xs font-light text-zinc-500">Ready</span>
                    </div>
                  </div>
                </div>
                
                {/* Character description - subtly placed */}
                <p className="text-sm font-light text-zinc-600 max-w-md mx-auto leading-relaxed">
                  {character.description || character.goal}
                </p>
              </div>
            </div>

            {/* Chat area - the main focus */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="max-w-2xl mx-auto px-8 py-8">
                {messages.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-12 h-12 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <MessageCircle size={16} className="text-zinc-400" />
                    </div>
                    <p className="text-lg font-extralight text-zinc-600 mb-2">Begin the conversation</p>
                    <p className="text-sm font-light text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      Share your thoughts or ask about your goal
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-6 py-4 rounded-3xl transition-all duration-300 ${
                          msg.isUser 
                            ? 'bg-zinc-900 text-white' 
                            : 'bg-white/80 backdrop-blur-sm border border-white/30 text-zinc-700'
                        }`}>
                          <p className="text-base font-light leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input area - clean and focused */}
            <div className="px-8 py-6 bg-white/40 backdrop-blur-xl border-t border-white/20">
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Your message..."
                      className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm border border-white/30 rounded-3xl text-base font-light text-zinc-700 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                      rows={1}
                      style={{ minHeight: '52px', maxHeight: '120px' }}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-14 h-14 p-0 bg-zinc-900 hover:bg-zinc-700 disabled:bg-zinc-300 disabled:opacity-50 text-white rounded-3xl transition-all duration-300 flex items-center justify-center border-0"
                  >
                    <Send size={18} />
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
