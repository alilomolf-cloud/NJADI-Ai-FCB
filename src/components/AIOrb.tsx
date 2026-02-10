
import React, { useState, useRef, useEffect } from 'react';
import { generateAIChat, generateAIImage, speakText } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import WolfGraphic from './WolfGraphic';

interface AIOrbProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  language: Language;
}

const AIOrb: React.FC<AIOrbProps> = ({ isOpen, setIsOpen, language }) => {
  const [messages, setMessages] = useState<(ChatMessage & { imageUrl?: string })[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 200 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ x: 0, y: 0 });

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      if (mode === 'image') {
        const url = await generateAIImage(userMsg);
        setMessages(prev => [...prev, { role: 'model', text: language === Language.AR ? "تفضل، صورتك المصممة خصيصاً لك جاهزة!" : "Your custom masterpiece is ready!", imageUrl: url }]);
      } else {
        const response = await generateAIChat(userMsg, messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })));
        setMessages(prev => [...prev, { role: 'model', text: response || "" }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: language === Language.AR ? "حدث خطأ في الاتصال بالسحاب..." : "Sky-link connection failed..." }]);
    } finally { setIsLoading(false); }
  };

  const copy = (t: string) => navigator.clipboard.writeText(t);
  
  const saveImage = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `F-NJADI-AI-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onStart = (e: any) => {
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    dragRef.current = { x: cx - pos.x, y: cy - pos.y };
    setIsDragging(true);
  };

  const onMove = (e: any) => {
    if (!isDragging) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    setPos({ x: cx - dragRef.current.x, y: cy - dragRef.current.y });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', () => setIsDragging(false));
      window.addEventListener('touchmove', onMove);
      window.addEventListener('touchend', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
    };
  }, [isDragging]);

  return (
    <>
      {/* Floating Orb - The Soul of the App */}
      <div 
        className="fixed z-[200] cursor-pointer touch-none"
        style={{ left: pos.x, top: pos.y }}
        onMouseDown={onStart}
        onTouchStart={onStart}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
      >
        {/* Subtle Wolf Shadow on Hover */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${isHovered ? 'scale-150 opacity-20' : 'scale-0 opacity-0'}`}>
          <WolfGraphic active={true} size={100} />
        </div>

        <div className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOpen ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100 rotate-0'}`}>
           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 border-2 border-white/20 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-50 animate-pulse"></div>
              <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'} text-white text-2xl relative z-10`}></i>
           </div>
        </div>
      </div>

      {/* AI Panel - The Star Curtain */}
      <div className={`fixed inset-0 z-[210] bg-black/95 backdrop-blur-3xl transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
         
         {/* Background Majestic Wolf - Animated during interactions */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <WolfGraphic 
              active={isLoading || isHovered} 
              size={500} 
              className={`transition-all duration-1000 ${isLoading ? 'opacity-20 scale-110 blur-sm' : 'opacity-5 scale-90 blur-md'}`} 
            />
         </div>

         {/* Stars in Background */}
         <div className="absolute inset-0 pointer-events-none opacity-30">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white rounded-full animate-pulse" 
                style={{ 
                  width: Math.random() * 2 + 1 + 'px', 
                  height: Math.random() * 2 + 1 + 'px', 
                  top: Math.random() * 100 + '%', 
                  left: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 5 + 's'
                }}
              ></div>
            ))}
         </div>

         <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 relative z-10 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              <h3 className="text-white font-black text-xs tracking-[0.3em] uppercase">Usra AI Soul</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white text-3xl transition-colors">&times;</button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-8 relative z-10 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 duration-500`}>
                <div className={`max-w-[88%] p-5 rounded-2xl relative ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-xl' : 'bg-white/10 text-gray-200 rounded-tl-none border border-white/10 backdrop-blur-md'}`}>
                  {m.imageUrl && (
                    <div className="relative mb-4 group overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                      <img src={m.imageUrl} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" alt="Generated by Usra AI" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <button 
                          onClick={() => saveImage(m.imageUrl!)}
                          className="w-full py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                          <i className="fa-solid fa-download mr-2"></i> Quick Save
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm leading-relaxed tracking-wide">{m.text}</p>
                  
                  {m.role === 'model' && (
                    <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-white/5">
                       <button onClick={() => speakText(m.text)} className="text-[9px] font-black text-blue-400 uppercase tracking-[0.1em] flex items-center gap-1.5 hover:text-white transition-colors">
                          <i className="fa-solid fa-microphone-lines"></i> {language === Language.AR ? "استماع" : "Listen"}
                       </button>
                       <button onClick={() => copy(m.text)} className="text-[9px] font-black text-gray-500 uppercase tracking-[0.1em] flex items-center gap-1.5 hover:text-white transition-colors">
                          <i className="fa-solid fa-copy"></i> {language === Language.AR ? "نسخ" : "Copy"}
                       </button>
                       {m.imageUrl && (
                         <button 
                           onClick={() => saveImage(m.imageUrl!)} 
                           className="text-[9px] font-black text-green-500 uppercase tracking-[0.1em] flex items-center gap-1.5 hover:text-white transition-colors animate-bounce"
                         >
                            <i className="fa-solid fa-cloud-arrow-down"></i> {language === Language.AR ? "حفظ في الاستوديو" : "Save to Gallery"}
                         </button>
                       )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 px-5 py-3 rounded-2xl flex items-center gap-2 border border-white/5 animate-pulse">
                  <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase italic">Usra is creating...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
         </div>

         <div className="p-4 bg-black/80 border-t border-white/10 pb-12 relative z-10">
            <div className="flex gap-2 mb-4">
               <button 
                onClick={() => setMode('chat')} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${mode === 'chat' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-white/5 text-gray-500 border border-white/5'}`}
               >
                 <i className="fa-solid fa-message mr-2"></i> TEXT
               </button>
               <button 
                onClick={() => setMode('image')} 
                className={`flex-1 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${mode === 'image' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]' : 'bg-white/5 text-gray-500 border border-white/5'}`}
               >
                 <i className="fa-solid fa-wand-magic mr-2"></i> ART
               </button>
            </div>
            <div className="flex gap-2 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all duration-300">
               <input 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={mode === 'chat' ? (language === Language.AR ? "اسأل روح نجادي..." : "Ask the soul of Njadi...") : (language === Language.AR ? "تخيل شيئاً جميلاً..." : "Imagine something beautiful...") } 
                className="flex-1 bg-transparent text-white text-sm outline-none px-4 placeholder:text-gray-600" 
               />
               <button 
                onClick={handleSend} 
                disabled={isLoading}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all active:scale-90 ${isLoading ? 'bg-gray-800' : 'bg-blue-600 shadow-xl hover:bg-blue-500'}`}
               >
                 <i className={`fa-solid ${isLoading ? 'fa-spinner animate-spin' : 'fa-paper-plane'}`}></i>
               </button>
            </div>
         </div>
      </div>
    </>
  );
};

export default AIOrb;
