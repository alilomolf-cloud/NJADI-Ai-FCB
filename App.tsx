
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Splash from './components/Splash';
import AIOrb from './components/AIOrb';
import MediaDownloader from './components/MediaDownloader';
import { Language, ThemeMode, ThemePalette } from './types';
import { TRANSLATIONS, THEME_PALETTES } from './constants';
import { playGreeting } from './services/geminiService';

const App: React.FC = () => {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [isAppLaunched, setIsAppLaunched] = useState(false);
  const [language, setLanguage] = useState<Language>(Language.AR);
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.CHAMELEON);
  const [currentPalette, setCurrentPalette] = useState<ThemePalette>(THEME_PALETTES[ThemeMode.MOONLIGHT]);
  const [showAI, setShowAI] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize Theme Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-theme', currentPalette.primary);
    root.style.setProperty('--secondary-theme', currentPalette.secondary);
    root.style.setProperty('--accent-theme', currentPalette.accent);
    root.style.setProperty('--glow-theme', currentPalette.glow);
  }, [currentPalette]);

  // Chameleon Logic
  useEffect(() => {
    if (themeMode !== ThemeMode.CHAMELEON) {
      setCurrentPalette(THEME_PALETTES[themeMode] || THEME_PALETTES[ThemeMode.MOONLIGHT]);
      return;
    }
    const paletteList = Object.values(THEME_PALETTES);
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % paletteList.length;
      setCurrentPalette(paletteList[index]);
    }, 8000); // Slower, more elegant transitions
    return () => clearInterval(interval);
  }, [themeMode]);

  useEffect(() => {
    const checkKey = async () => {
      try {
        const selected = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(selected);
      } catch (e) {
        setHasApiKey(false);
      }
    };
    if (!isSplashActive) checkKey();
  }, [isSplashActive]);

  const handleSplashFinish = useCallback(() => setIsSplashActive(false), []);

  const handleActivateKey = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      // Assume success as per guidelines
      setHasApiKey(true);
    } catch (e) { console.error(e); }
  };

  const handleLaunch = () => {
    setIsAppLaunched(true);
    playGreeting(TRANSLATIONS[language].greetingText);
  };

  if (isSplashActive) return <Splash onFinish={handleSplashFinish} />;

  if (hasApiKey === false) {
    return (
      <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-8">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1557008075-0f230d09e88a?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
          <div className="fog-layer"></div>
        </div>
        <div className="relative z-10 text-center animate-in zoom-in duration-700">
          <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/50">
            <i className="fa-solid fa-key text-blue-500 text-3xl"></i>
          </div>
          <h2 className="text-white text-2xl font-black mb-4 tracking-tighter uppercase">Security Protocol</h2>
          <p className="text-gray-400 text-sm mb-8 max-w-xs leading-relaxed">تطبيق F NJADI يتطلب مفتاح API نشطاً للعمل. يرجى تفعيل حسابك الآن.</p>
          <button onClick={handleActivateKey} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 transition-transform">Activate Soul</button>
        </div>
      </div>
    );
  }

  if (hasApiKey === true && !isAppLaunched) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1557008075-0f230d09e88a?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover" />
          <div className="fog-layer"></div>
        </div>
        <button onClick={handleLaunch} className="relative z-10 flex flex-col items-center gap-8 group">
          <div className="w-32 h-32 rounded-full border-4 border-white/20 flex items-center justify-center transition-all duration-700 group-hover:border-blue-500 group-active:scale-90" style={{ boxShadow: '0 0 60px var(--glow-theme)' }}>
            <i className="fa-solid fa-fingerprint text-white text-5xl animate-pulse"></i>
          </div>
          <div className="text-center">
            <span className="text-white text-2xl font-black tracking-[0.4em] block mb-2">ACCESS GRANTED</span>
            <span className="text-blue-400 font-mono text-xs uppercase tracking-widest opacity-60">Touch to initiate session</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      {/* Dynamic Border Glow */}
      <div className="absolute inset-0 pointer-events-none z-30 border-[3px] transition-colors duration-1000" style={{ borderColor: 'var(--primary-theme)', boxShadow: 'inset 0 0 40px var(--glow-theme)' }}></div>
      
      {/* Top Shield Bar */}
      <div className="relative z-40 h-14 bg-black/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white leading-none">SHIELD ACTIVE</span>
            <span className="text-[8px] font-mono text-gray-500 tracking-tighter uppercase">IP: MASKED • UA: Mobile-13</span>
          </div>
        </div>
        <span className="text-xl font-black italic text-white tracking-tighter">F <span style={{ color: 'var(--primary-theme)' }}>NJADI</span></span>
        <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors">
          <i className="fa-solid fa-sliders"></i>
        </button>
      </div>

      {/* Main Social Hub (WebView) */}
      <div className="flex-1 relative bg-[#18191a]">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-0 p-12 text-center">
           <i className="fa-brands fa-facebook text-blue-600 text-7xl mb-6 opacity-10"></i>
           <p className="text-gray-700 text-sm italic font-medium">
             Initializing secure bridge to Facebook...<br/>
             <span className="text-[10px] opacity-50">(Visible only in production APK)</span>
           </p>
        </div>
        <iframe 
          ref={iframeRef} 
          src="https://m.facebook.com" 
          className="w-full h-full border-none relative z-10" 
          allow="camera; microphone; geolocation" 
          title="Facebook Social Bridge"
        />
      </div>

      {/* Luxury Navigation */}
      <div className="relative z-40 h-18 bg-black border-t border-white/5 flex items-center justify-around pb-2 px-2">
         <NavBtn icon="fa-house" active />
         <NavBtn icon="fa-user-group" />
         <NavBtn icon="fa-comment-dots" badge="3" />
         <NavBtn icon="fa-video" />
         <NavBtn icon="fa-bars" onClick={() => setShowSettings(true)} />
      </div>

      {/* AI Intelligence Components */}
      <AIOrb isOpen={showAI} setIsOpen={setShowAI} language={language} />
      <MediaDownloader language={language} />

      {/* Settings Star Curtain */}
      {showSettings && (
        <div className="absolute inset-0 z-[150] bg-black/98 p-8 animate-in slide-in-from-bottom duration-700 backdrop-blur-3xl">
           <div className="flex justify-between items-center mb-12">
              <h2 className="text-white font-black text-2xl tracking-tighter italic">COMMAND CENTER</h2>
              <button onClick={() => setShowSettings(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white text-3xl transition-transform active:scale-90">&times;</button>
           </div>
           
           <div className="space-y-10">
              <section>
                 <h3 className="text-blue-500 text-[10px] uppercase mb-4 font-black tracking-[0.3em]">Identity & Protection</h3>
                 <div className="grid grid-cols-1 gap-3">
                    <StatusCard icon="fa-shield-halved" label="Anti-Ban Shield" status="ACTIVE" color="text-green-500" />
                    <StatusCard icon="fa-user-secret" label="Device Spoofing" status="ENABLED" color="text-green-500" />
                 </div>
              </section>

              <section>
                 <h3 className="text-gray-500 text-[10px] uppercase mb-4 font-black tracking-[0.3em]">Language Soul</h3>
                 <div className="grid grid-cols-3 gap-3">
                    {Object.values(Language).map(l => (
                      <button 
                        key={l} 
                        onClick={() => setLanguage(l)} 
                        className={`py-4 rounded-2xl border text-[10px] font-black tracking-widest transition-all ${language === l ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'text-white border-white/10 bg-white/5'}`}
                      >
                        {l}
                      </button>
                    ))}
                 </div>
              </section>

              <section>
                 <h3 className="text-gray-500 text-[10px] uppercase mb-4 font-black tracking-[0.3em]">Aesthetic Matrix</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setThemeMode(ThemeMode.CHAMELEON)} 
                      className={`py-4 rounded-2xl border text-[10px] font-black tracking-widest transition-all ${themeMode === ThemeMode.CHAMELEON ? 'bg-white text-black' : 'text-white border-white/10 bg-white/5'}`}
                    >
                      CHAMELEON
                    </button>
                    <button 
                      onClick={() => setThemeMode(ThemeMode.MOONLIGHT)} 
                      className={`py-4 rounded-2xl border text-[10px] font-black tracking-widest transition-all ${themeMode === ThemeMode.MOONLIGHT ? 'bg-white text-black' : 'text-white border-white/10 bg-white/5'}`}
                    >
                      FIXED MOON
                    </button>
                 </div>
              </section>
           </div>
           
           <div className="absolute bottom-12 left-0 right-0 text-center">
              <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Designed by Ali Ould Njadi • v1.0.0 Stable</p>
           </div>
        </div>
      )}
    </div>
  );
};

const NavBtn = ({ icon, active, badge, onClick }: any) => (
  <button onClick={onClick} className={`relative flex-1 flex flex-col items-center justify-center h-full transition-all ${active ? 'text-white scale-110' : 'text-gray-600 hover:text-gray-400'}`}>
    <i className={`fa-solid ${icon} text-xl`}></i>
    {badge && <span className="absolute top-4 right-6 bg-red-600 text-[9px] text-white px-1.5 py-0.5 rounded-full font-black border border-black shadow-lg">{badge}</span>}
    {active && <div className="absolute bottom-2 w-6 h-1 bg-white rounded-full" style={{ boxShadow: '0 0 15px var(--glow-theme)' }}></div>}
  </button>
);

const StatusCard = ({ icon, label, status, color }: any) => (
  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <i className={`fa-solid ${icon} text-blue-500 text-lg`}></i>
      <span className="text-xs text-gray-300 font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={`${color} text-[10px] font-black italic`}>{status}</span>
  </div>
);

export default App;
