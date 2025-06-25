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
  const cardRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
        setIsFlipped(false);
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
            className="w-full h-full cursor-pointer"
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

      {/* Full-screen chat interface when flipped */}
      {isFlipped && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div 
            ref={chatContainerRef}
            className="w-full max-w-6xl h-full max-h-[95vh] bg-gradient-to-br from-white via-zinc-50 to-zinc-100 rounded-3xl shadow-3xl border border-zinc-200/50 flex flex-col overflow-hidden animate-scale-in"
          >
            
            {/* Redesigned Header with Character Portrait */}
            <div className="relative p-8 bg-white/70 backdrop-blur-xl border-b border-zinc-200/30">
              {/* Back Button */}
              <Button
                onClick={handleBackClick}
                className="absolute top-6 left-6 w-12 h-12 p-0 bg-white/80 hover:bg-white border border-zinc-200/50 text-zinc-600 hover:text-zinc-800 rounded-full transition-all duration-300 hover:scale-105 z-10"
              >
                <ArrowLeft size={18} />
              </Button>

              {/* Share Button */}
              <Button
                onClick={handleShareClick}
                className="absolute top-6 right-6 w-12 h-12 p-0 bg-white/80 hover:bg-white border border-zinc-200/50 text-zinc-600 hover:text-zinc-800 rounded-full transition-all duration-300 hover:scale-105 z-10"
              >
                <Share size={18} />
              </Button>

              {/* Character Profile Section */}
              <div className="flex items-start gap-8 max-w-5xl mx-auto">
                {/* Character Portrait - Made Larger */}
                <div className="relative flex-shrink-0">
                  <div className="w-40 h-40 rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 shadow-lg">
                    <img
                      src={character.image_url}
                      alt={`Character ${character.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop`;
                      }}
                    />
                  </div>
                  {/* Subtle glow around portrait */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                </div>

                {/* Character Information */}
                <div className="flex-1 space-y-6">
                  {/* Header */}
                  <div>
                    <h2 className="text-2xl font-extralight text-zinc-900 mb-2 tracking-tight">
                      Character #{character.id}
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm font-light text-zinc-500 uppercase tracking-wider">
                        Ready to help
                      </span>
                    </div>
                  </div>

                  {/* Goal Section with Flip Animation */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsGoalFlipped(true)}
                    onMouseLeave={() => setIsGoalFlipped(false)}
                    style={{ 
                      perspective: '1000px',
                      height: '160px' // Fixed height to prevent layout shift
                    }}
                  >
                    <div 
                      className="relative w-full h-full transition-transform duration-500 preserve-3d cursor-pointer"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        transform: isGoalFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front Side - Goal and Progress */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-50/60 to-indigo-50/60 rounded-2xl p-6 border border-zinc-200/30"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)'
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                              Current Goal
                            </p>
                            <p className="text-lg font-light text-zinc-700 leading-relaxed">
                              {character.goal}
                            </p>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                              Progress
                            </span>
                            <span className="text-sm font-light text-zinc-600">
                              {progress}%
                            </span>
                          </div>
                          <Progress 
                            value={progress} 
                            className="h-2 bg-white/60 border border-zinc-200/50" 
                          />
                        </div>
                      </div>

                      {/* Back Side - Character Description */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-purple-50/60 to-pink-50/60 rounded-2xl p-6 border border-zinc-200/30"
                        style={{ 
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                          Character Description
                        </p>
                        <p className="text-lg font-light text-zinc-700 leading-relaxed">
                          {character.description || "A thoughtful companion ready to help you achieve your goals through meaningful conversations and gentle guidance."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Personality Traits */}
                  <div className="flex flex-wrap gap-2">
                    {['Supportive', 'Insightful', 'Patient'].map((trait) => (
                      <div 
                        key={trait}
                        className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-zinc-200/40 rounded-full text-xs font-light text-zinc-600 hover:bg-white/80 transition-colors duration-300"
                      >
                        {trait}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-8 overflow-y-auto scrollbar-hide">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.length === 0 && (
                  <div className="text-center py-20">
                    <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-white/60 to-zinc-100/60 border border-zinc-200/50">
                      <div className="w-16 h-16 bg-gradient-to-br from-zinc-200 to-zinc-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <MessageCircle size={20} className="text-zinc-500" />
                      </div>
                      <p className="text-xl font-extralight text-zinc-700 mb-3">Ready to begin</p>
                      <p className="text-sm font-light text-zinc-500 leading-relaxed max-w-md">
                        Share your thoughts, ask questions, or discuss your progress toward your goal
                      </p>
                    </div>
                  </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-6 rounded-3xl ${
                      msg.isUser 
                        ? 'bg-zinc-900 text-white' 
                        : 'bg-white/80 backdrop-blur-sm border border-zinc-200/50 text-zinc-700'
                    } transition-all duration-300 hover:scale-[1.02] shadow-sm`}>
                      <p className="text-base font-light leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-zinc-200/30 bg-white/70 backdrop-blur-xl">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-4 items-end">
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share your thoughts..."
                      className="w-full p-6 pr-16 bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-3xl text-base font-light text-zinc-700 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:border-transparent transition-all duration-300 shadow-sm"
                      rows={1}
                      style={{ minHeight: '64px', maxHeight: '120px' }}
                    />
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="w-16 h-16 p-0 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:opacity-50 text-white rounded-3xl transition-all duration-300 flex items-center justify-center hover:scale-105 shadow-lg"
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
