
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface MediaDownloaderProps {
  language: Language;
}

interface MediaQuality {
  label: string;
  value: string;
  size: string;
}

const MediaDownloader: React.FC<MediaDownloaderProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [downloadComplete, setDownloadComplete] = useState(false);

  const qualities: MediaQuality[] = [
    { label: '4K Ultra HD', value: '4k', size: '124MB' },
    { label: '1080p Full HD', value: '1080p', size: '45MB' },
    { label: '720p HD', value: '720p', size: '18MB' },
    { label: 'SD Quality', value: 'sd', size: '5MB' },
  ];

  const handleDownload = () => {
    setIsDownloading(true);
    setProgress(0);
    setDownloadComplete(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
            setDownloadComplete(true);
            setTimeout(() => {
                setDownloadComplete(false);
                setIsOpen(false);
            }, 2000);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const labels = {
    [Language.AR]: {
      title: "تحميل المحتوى",
      detect: "تم اكتشاف فيديو/صورة",
      quality: "اختر الجودة",
      start: "بدء التحميل",
      done: "تم الحفظ بنجاح!",
      cancel: "إلغاء"
    },
    [Language.FR]: {
      title: "Téléchargeur",
      detect: "Média détecté",
      quality: "Qualité",
      start: "Télécharger",
      done: "Enregistré !",
      cancel: "Annuler"
    },
    [Language.EN]: {
      title: "Downloader",
      detect: "Media Detected",
      quality: "Select Quality",
      start: "Download Now",
      done: "Saved to Gallery!",
      cancel: "Cancel"
    }
  }[language];

  return (
    <>
      {/* Floating Download Trigger */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-6 bottom-24 z-[100] w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white shadow-2xl active:scale-95 transition-all"
        style={{ boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
      >
        <i className="fa-solid fa-cloud-arrow-down text-xl"></i>
      </button>

      {/* Overlay Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-md flex items-end justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0a0a] border-t border-white/10 rounded-t-[2.5rem] p-8 pb-12 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-white font-black text-xl tracking-tight uppercase">{labels.title}</h2>
                <p className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">{labels.detect}</p>
              </div>
              <button onClick={() => !isDownloading && setIsOpen(false)} className="text-white/40 text-2xl">&times;</button>
            </div>

            {!isDownloading && !downloadComplete ? (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-500 text-[10px] uppercase font-bold mb-3 tracking-widest">{labels.quality}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {qualities.map((q) => (
                      <button 
                        key={q.value}
                        onClick={() => setSelectedQuality(q.value)}
                        className={`p-4 rounded-2xl border text-left transition-all ${selectedQuality === q.value ? 'bg-white border-white text-black' : 'bg-white/5 border-white/10 text-white'}`}
                      >
                        <div className="text-xs font-black">{q.label}</div>
                        <div className={`text-[9px] ${selectedQuality === q.value ? 'text-black/50' : 'text-gray-500'}`}>{q.size}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleDownload}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all"
                >
                  {labels.start}
                </button>
              </div>
            ) : downloadComplete ? (
              <div className="py-12 text-center animate-in zoom-in">
                <div className="w-20 h-20 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-check text-green-500 text-3xl"></i>
                </div>
                <p className="text-white font-black uppercase tracking-widest">{labels.done}</p>
              </div>
            ) : (
              <div className="py-10 space-y-8">
                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Downloading {selectedQuality}...</span>
                   <span className="text-white font-mono text-xl">{Math.round(progress)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaDownloader;
