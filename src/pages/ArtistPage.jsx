import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtistDetails } from '../hooks/useArtistDetails';
import Navbar from '../components/navbar';

export default function ArtistPage() {
  const { idArtist } = useParams();
  const navigate = useNavigate();
  const { artist, albums, topTracks, bio, loading, error } = useArtistDetails(idArtist);  const [esFavorito, setEsFavorito] = useState(false);
  const scrollRef = useRef(null);

  // --- LÓGICA DE POPULARIDAD ANIMADA ---
  const [popAnimada, setPopAnimada] = useState(0);

  const calcularPopularidad = () => {
    if (!topTracks.length) return 0;
    const suma = topTracks.reduce((acc, track) => acc + (track.rank || 0), 0);
    const promedioRank = suma / topTracks.length;
    return Math.min(Math.round(promedioRank / 10000), 100); 
  };

  const metaPopularidad = calcularPopularidad();

  useEffect(() => {
    if (metaPopularidad === 0) return;
    
    let inicio = 0;
    const duracionAnimacion = 1500; // 1.5 segundos
    const fps = 1000 / 60; // 60 frames por segundo
    const incremento = metaPopularidad / (duracionAnimacion / fps);

    const temporizador = setInterval(() => {
      inicio += incremento;
      if (inicio >= metaPopularidad) {
        setPopAnimada(metaPopularidad);
        clearInterval(temporizador);
      } else {
        setPopAnimada(Math.floor(inicio));
      }
    }, fps);

    return () => clearInterval(temporizador);
  }, [metaPopularidad]);

  // --- LÓGICA DEL SCROLL ---
  const ejecutarScroll = (direccion) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const jalarEspacio = clientWidth * 0.5; // Mueve media pantalla para controlarlo mejor al ser más pequeño
      scrollRef.current.scrollTo({
        left: direccion === 'izq' ? scrollLeft - jalarEspacio : scrollLeft + jalarEspacio,
        behavior: 'smooth'
      });
    }
  };

  const formatearNumero = (num) => {
    if (!num) return '0';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121015] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#4D88FF] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-zinc-400">Cargando perfil del artista...</p>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="min-h-screen bg-[#121015] flex flex-col items-center justify-center text-white p-6">
        <p className="text-red-400 text-xl mb-4">{error || "Artista no encontrado"}</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors">
          Volver atrás
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121015] text-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="flex flex-col md:flex-row w-full max-w-7xl md:h-[80vh] gap-6">
          
          {/* ==========================================
              COLUMNA IZQUIERDA (Info Actualizada)
          ========================================== */}
          <div className="w-full md:w-[30%] bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col relative shadow-xl backdrop-blur-sm">
            
            <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden border-4 border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <img 
                src={artist.picture_big || artist.picture_medium} 
                alt={artist.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* TEXTOS ACTUALIZADOS SEGÚN TU BOCETO */}
            {/* TEXTOS DINÁMICOS CON LAS DOS APIS */}
              <div className="flex flex-col flex-grow text-zinc-300 gap-3">
                <h1 className="text-4xl font-bold text-white mb-4 tracking-tight line-clamp-2">{artist.name}</h1>
                
                <p>
                  <strong className="text-zinc-500">Año de formación:</strong>{' '}
                  {bio?.intFormedYear || 'Desconocido'}
                </p>
                
                <p>
                  <strong className="text-zinc-500">Origen:</strong>{' '}
                  {bio?.strCountry || 'Desconocido'}
                </p>
                
                <p>
                  <strong className="text-zinc-500">Género:</strong>{' '}
                  {bio?.strGenre || 'Varios'}
                </p>
              </div>

            <button 
              onClick={() => setEsFavorito(!esFavorito)}
              className="absolute bottom-8 right-8 text-3xl transition-all duration-300 hover:scale-110"
            >
              {esFavorito ? '❤️' : '🤍'}
            </button>
          </div>

          {/* ==========================================
              COLUMNA DERECHA
          ========================================== */}
          <div className="w-full md:w-[70%] flex flex-col gap-6 h-full">
            
            {/* SECCIÓN SUPERIOR: ÁLBUMES (Reducido de tamaño) */}
            {/* Se ha reducido el padding (p-6) y la altura mínima (min-h-[260px]) */}
            <div className="h-[55%] min-h-[260px] bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-6 flex flex-col shadow-xl">
              <h2 className="text-xl font-bold mb-4 text-white border-b border-zinc-800 pb-3">
                Álbumes / Singles <span className="text-sm font-normal text-zinc-500">({albums.length})</span>
              </h2>
              
              <div className="flex items-center w-full flex-grow relative overflow-hidden">
                <button onClick={() => ejecutarScroll('izq')} className="absolute left-0 z-10 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#4D88FF] transition-colors shadow-md text-sm">
                  ←
                </button>

                {/* Tarjetas más pequeñas (w-24 h-24 / md:w-28 md:h-28) y menos separación (gap-4) */}
                <div 
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto px-10 w-full h-full items-center snap-x pb-2 scrollbar-hide"
                >
                  {albums.length === 0 ? (
                    <p className="text-zinc-500 mx-auto">No se encontraron álbumes disponibles.</p>
                  ) : (
                    albums.map((album) => (
                      <div 
                        key={album.id} 
                        className="min-w-[110px] flex flex-col items-center group snap-center cursor-pointer"
                      >
                        <div className="w-24 h-24 md:w-28 md:h-28 bg-zinc-800 rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 border border-zinc-700/50 shadow-md relative">
                          <img 
                            src={album.cover_medium} 
                            alt={album.title} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <p className="text-[11px] font-semibold mt-2 text-zinc-300 text-center w-28 truncate group-hover:text-white">
                          {album.title}
                        </p>
                        <p className="text-[9px] text-zinc-500">
                          {album.release_date ? album.release_date.split('-')[0] : ''}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <button onClick={() => ejecutarScroll('der')} className="absolute right-0 z-10 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-[#4D88FF] transition-colors shadow-md text-sm">
                  →
                </button>
              </div>
            </div>

            {/* SECCIÓN INFERIOR: HITOS */}
            <div className="h-[45%] flex flex-col min-h-[180px]">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] flex-grow bg-zinc-800"></div>
                <h2 className="text-lg font-bold text-zinc-400 uppercase tracking-widest">Hitos</h2>
                <div className="h-[1px] flex-grow bg-zinc-800"></div>
              </div>

              <div className="flex gap-4 h-full flex-grow">
                
                {/* Popularidad Animada */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:bg-zinc-800/60 transition-colors shadow-lg">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Popularidad</span>
                  {/* Aquí pintamos la variable animada en lugar de la fija */}
                  <span className="text-3xl md:text-5xl font-bold text-[#4D88FF]">
                    {popAnimada}%
                  </span>
                </div>

                {/* Oyentes / Número de Fans en Deezer */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:bg-zinc-800/60 transition-colors shadow-lg">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Fans Globales</span>
                  <span className="text-3xl md:text-5xl font-bold text-white">
                    {formatearNumero(artist.nb_fan)}
                  </span>
                </div>

                {/* Pistas Top */}
                <div className="flex-1 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 hover:bg-zinc-800/60 transition-colors shadow-lg">
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Pistas Top</span>
                  <span className="text-3xl md:text-5xl font-bold text-zinc-300">
                    {topTracks.length > 0 ? `+${topTracks.length}` : '0'}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}