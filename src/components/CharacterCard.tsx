import { Card } from "@/types/Card";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { MessageCircle, ArrowLeft, Send, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface CharacterCardProps {
  character: Card;
  className?: string;
}

interface ConversationMessage {
  text: string;
  isUser: boolean;
  isCharacterIntro?: boolean;
}

const CharacterCard = ({ character, className = "" }: CharacterCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoalAchieved, setIsGoalAchieved] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    
    const introMessage: ConversationMessage = {
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

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || isLoading) return;
    
    const userMessage = message.trim();
    setMessage("");
    setIsLoading(true);
    
    // Add user message to UI immediately
    const newUserMessage: ConversationMessage = {
      text: userMessage,
      isUser: true
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Add loading indicator
    const loadingMessage: ConversationMessage = {
      text: "...",
      isUser: false
    };
    setMessages(prev => [...prev, loadingMessage]);
    
    try {
      const response = await fetch('https://yevyfxmmijukjohbdjwv.supabase.co/functions/v1/play-turn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          card_id: character.id.toString(),
          user_message: userMessage
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      console.log('API Response:', data);
      
      // Remove loading message and add AI response
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1);
        return [...withoutLoading, {
          text: data.ai_response,
          isUser: false
        }];
      });
      
      // Update progress
      setProgress(prev => Math.min(prev + 10, 100));
      
      // Check if goal is achieved
      if (data.is_goal_achieved && !isGoalAchieved) {
        setIsGoalAchieved(true);
        setProgress(100);
        toast({
          title: "Goal Achieved! 🎉",
          description: "You've successfully completed the character's objective!",
        });
      }
      
    } catch (error) {
      console.error('Error calling play-turn API:', error);
      
      // Remove loading message and show error
      setMessages(prev => {
        const withoutLoading = prev.slice(0, -1);
        return [...withoutLoading, {
          text: "Sorry, I'm having trouble connecting. Please try again.",
          isUser: false
        }];
      });
      
      toast({
        title: "Connection Error",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Restore focus to textarea after message is sent
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [message, isLoading, character.id, isGoalAchieved, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleShareClick = useCallback(async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    const uniqueURL = `${window.location.origin}/play/${character.id}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Character #${character.id}`,
          text: `Check out this character: ${character.goal}`,
          url: uniqueURL,
        });
        
        toast({
          title: "Shared successfully",
          description: "Character link has been shared",
        });
      } else {
        await navigator.clipboard.writeText(uniqueURL);
        
        toast({
          title: "Link copied",
          description: "Character URL copied to clipboard",
        });
      }
    } catch (error) {
      console.log('Sharing failed:', error);
      
      try {
        await navigator.clipboard.writeText(uniqueURL);
        toast({
          title: "Link copied",
          description: "Character URL copied to clipboard",
        });
      } catch (clipboardError) {
        toast({
          title: "Share failed",
          description: "Unable to share character link",
          variant: "destructive",
        });
      }
    } finally {
      setTimeout(() => setIsSharing(false), 300);
    }
  }, [character.id, character.goal, isSharing, toast]);

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (!isFlipped || messages.length === 0) return;
    
    // Scroll to bottom smoothly
    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (scrollElement) {
      setTimeout(() => {
        scrollElement.scrollTo({
          top: scrollElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [messages, isFlipped]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    // Reset height to recalculate
    textarea.style.height = 'auto';
    
    // Set to scrollHeight (content height), max 240px
    const newHeight = Math.min(textarea.scrollHeight, 240);
    textarea.style.height = `${newHeight}px`;
  }, [message]);

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
          style={{ 
            width: isMobile ? 'calc(100vw - 32px)' : '320px',
            height: isMobile ? 'calc((100vw - 32px) * 1.5)' : '480px',
            maxWidth: isMobile ? '500px' : '320px',
            maxHeight: isMobile ? '750px' : '480px'
          }}
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
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-0 md:p-4">
          <div 
            ref={chatContainerRef}
            className="w-full h-full bg-white/95 backdrop-blur-xl shadow-3xl border-white/20 flex flex-col overflow-hidden md:max-w-6xl md:max-h-[90vh] md:rounded-3xl md:border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 md:p-6 border-b border-zinc-100">
              <Button
                onClick={handleBackClick}
                variant="ghost"
                size="sm"
                className="rounded-full h-8 w-8 p-0 hover:bg-zinc-100"
              >
                <ArrowLeft size={16} />
              </Button>

              <div className="flex items-center gap-4">
                <div className="text-xs font-medium text-muted-foreground tracking-wider uppercase hidden md:block">
                  Character #{character.id}
                </div>
                {isGoalAchieved && (
                  <div className="text-xs font-semibold text-primary tracking-wider uppercase bg-primary/10 px-4 py-2 rounded-full border border-primary/20 shadow-sm">
                    Goal Achieved! 🎉
                  </div>
                )}
              </div>

              <Button
                onClick={handleShareClick}
                variant="ghost"
                size="sm"
                disabled={isSharing}
                className={`rounded-full h-8 w-8 p-0 hover:bg-zinc-100 transition-all duration-200 flex ${
                  isSharing ? 'scale-95 opacity-70' : 'hover:scale-105'
                }`}
              >
                <Share 
                  size={16} 
                  className={`transition-transform duration-200 ${
                    isSharing ? 'animate-pulse' : ''
                  }`} 
                />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="px-3 py-2 md:px-6 md:py-4 border-b border-zinc-50 bg-gradient-to-br from-zinc-50/50 to-transparent">
              <p className="text-xs font-medium text-zinc-600 mb-1 md:mb-2 line-clamp-1 md:line-clamp-none">
                Goal: {character.goal}
              </p>
              <Progress 
                value={progress} 
                className={`h-2 md:h-3 ${isGoalAchieved ? 'bg-gradient-to-r from-green-200 via-green-300 to-green-200' : ''}`}
              />
            </div>

            {/* Chat messages */}
            <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 py-3 md:px-6 md:py-6">
              <div className="space-y-6">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                    {msg.isCharacterIntro ? (
                      <div className="flex flex-col items-center gap-6 max-w-full md:flex-row md:items-start md:gap-8">
                        <Avatar className="w-40 h-40 flex-shrink-0 ring-4 ring-zinc-200 shadow-lg md:w-32 md:h-32">
                          <AvatarImage
                            src={character.image_url}
                            alt={`Character ${character.id}`}
                            onError={(e) => {
                              e.currentTarget.src = `https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop`;
                            }}
                          />
                        </Avatar>
                        <div className="flex-1 space-y-4 w-full text-center md:text-left">
                          {character.description && (
                            <p className="text-base text-zinc-700 leading-relaxed md:text-lg">
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
                      <div className={`max-w-[90%] md:max-w-[75%] px-3 py-2 md:px-4 md:py-3 rounded-2xl transition-all duration-200 ${
                        msg.isUser 
                          ? 'bg-zinc-900 text-white ml-4' 
                          : msg.text === '...'
                            ? 'bg-zinc-50 text-zinc-400 mr-4 animate-pulse'
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
            <div className="p-3 md:p-6 border-t border-zinc-100">
              <div className="flex gap-2 md:gap-3 items-end">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isGoalAchieved ? "Goal achieved! Continue chatting..." : "Type your message..."}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm text-zinc-700 placeholder:text-zinc-400 resize-none focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-300 transition-all duration-200 disabled:opacity-50"
                    rows={1}
                    style={{ 
                      minHeight: isMobile ? '120px' : '60px',
                      maxHeight: '240px',
                      overflowY: 'auto'
                    }}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  size="sm"
                  className="rounded-full h-10 w-10 md:h-12 md:w-12 p-0"
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
