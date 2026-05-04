import { useState, useRef, useEffect } from 'react';

export const TopTrendingCard = ({ tracks }) => {
  // 1. Declaramos todos los hooks primero (SIEMPRE arriba)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // MAGIA: El useEffect debe estar aquí, antes de cualquier return
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Autoplay bloqueado", e));
    }
  }, [currentIndex, isPlaying]);

  // 2. AHORA SÍ, después de los hooks, hacemos la validación
  if (!tracks || tracks.length === 0) return null;

  // 3. Definimos las variables que dependen de los datos
  const track = tracks[currentIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  return (
    <div className="fixed bottom-24 right-8 z-[100] w-72 bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 transition-all duration-500 animate-in fade-in slide-in-from-right-8">
      
      {track.preview && (
        <audio 
          ref={audioRef} 
          src={track.preview} 
          onEnded={handleNext} 
        />
      )}

      <div className="relative h-14 w-14 flex-shrink-0">
        <img 
          key={track.id} 
          src={track.album.cover_medium} 
          alt={track.title} 
          className={`h-full w-full object-cover rounded-lg shadow-md transition-all duration-500 animate-in fade-in zoom-in-95 ${isPlaying ? 'scale-105 ring-2 ring-[#4D88FF]' : ''}`}
        />
        <div className="absolute -top-2 -left-2 bg-[#4D88FF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-lg">
          #{currentIndex + 1}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[#4D88FF] text-[10px] font-bold uppercase tracking-wider mb-0.5">
          {isPlaying ? 'Sonando ahora' : 'Top Global'}
        </p>
        <h4 className="text-white text-sm font-semibold truncate" title={track.title}>{track.title}</h4>
        <p className="text-zinc-400 text-xs truncate" title={track.artist.name}>{track.artist.name}</p>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={togglePlay}
          className="h-9 w-9 flex flex-shrink-0 items-center justify-center bg-white/10 hover:bg-[#4D88FF] text-white rounded-full transition-all group"
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:scale-110 transition-transform">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 pl-0.5 group-hover:scale-110 transition-transform">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button 
          onClick={handleNext}
          className="h-7 w-7 flex flex-shrink-0 items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-all group"
          title="Siguiente"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};