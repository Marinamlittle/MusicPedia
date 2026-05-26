import { useState, useMemo, useContext, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useTrends } from '../hooks/useTrends';
import { LanguageContext } from '../context/LanguageContext';
import { TopTrendingCard } from './TopTrendingCard'; 
import { getTopTracks, searchTracks } from '../services/deezerApi';

export default function Hero() {
  const [busqueda, setBusqueda] = useState('');
  const [sugerencias, setSugerencias] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const navigate = useNavigate();
  const { t } = useContext(LanguageContext);

  const misFavoritos = [
    'Justin Bieber', 'Camila Cabello', 'Shawn Mendes', 'Ariana Grande', 
    'Dua Lipa', 'The Weeknd', 'Taylor Swift', 'Bad Bunny', 'Selena Gomez', 
    'Ed Sheeran', 'BTS', 'Billie Eilish', 'Olivia Rodrigo', 'Drake',
    'Bruno Mars', 'Cardi B', 'Post Malone', 'Doja Cat', 'Harry Styles',
    'Fifth Harmony', 'Michael Jackson', 'Travis Scott', 'Kendrick Lamar',
    'Rihanna', 'SZA', 'The Kid LAROI', 'J Balvin', 'Rosalía',
  ];

  const tendenciasPopulares = ['The Weeknd', 'Bad Bunny', 'Justin Bieber', 'Bruno Mars'];
  const { images, loading } = useTrends(misFavoritos);

  // --- LLAMADA A LA API DE DEEZER AL CARGAR ---
  useEffect(() => {
    const fetchDeezerTop = async () => {
      console.log("Consultando la API de Deezer a través del proxy...");
      const tracks = await getTopTracks();
      if (tracks && tracks.length > 0) {
        console.log("¡Éxito! Canciones cargadas:", tracks.length);
        setTopTracks(tracks); // 
      }
    };
    fetchDeezerTop();
  }, []);

 // --- LÓGICA DE BÚSQUEDA EN TIEMPO REAL ---
 useEffect(() => {
  const delayDebounceFn = setTimeout(async () => {
    if (busqueda.trim().length > 1) {
      try {
        // 1. Consultamos a la API
        const resultados = await searchTracks(busqueda);
        const arrayResultados = Array.isArray(resultados) ? resultados : (resultados?.data || []);

        // 2. Filtramos para sacar solo artistas únicos
        const artistasVistos = new Set();
        const sugerenciasUnicas = [];

        for (const item of arrayResultados) {
          const nombreArtista = item.artist?.name;
          
          if (nombreArtista && !artistasVistos.has(nombreArtista)) {
            artistasVistos.add(nombreArtista); 
            sugerenciasUnicas.push(item);      
          }

          if (sugerenciasUnicas.length === 5) break; 
        }

        // 3. Guardamos los 5 resultados únicos
        setSugerencias(sugerenciasUnicas);
        
      } catch (error) {
        console.error("Error obteniendo sugerencias:", error);
        setSugerencias([]);
      }
    } else {
      setSugerencias([]);
    }
  }, 300); 

  return () => clearTimeout(delayDebounceFn);
}, [busqueda]);

// --- LAS DEMÁS FUNCIONES SE QUEDAN EXACTAMENTE IGUAL ---

const filasMezcladas = useMemo(() => {
  if (!images.length) return [[], [], [], []];
  const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
  return [
    images, shuffle(images), [...images].reverse(), shuffle([...images].reverse()) 
  ];
}, [images]);

const manejarBusqueda = (e) => {
  e.preventDefault();
  if (busqueda.trim() !== '') navigate(`/search/${busqueda}`);
};

const buscarTendencia = (tendencia) => {
  navigate(`/search/${tendencia}`);
};

return (
  <section className="relative w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center overflow-hidden bg-[#121015]">
      {/* CARRUSEL DINÁMICO */}
      {!loading && (
        <div className="absolute inset-0 flex flex-col gap-4 scale-125 opacity-30 pointer-events-none justify-center">
          {filasMezcladas.map((fila, i) => (
            <div 
              key={i} 
              className="flex gap-4 w-max animate-scroll" 
              style={{ 
                animationDuration: `${80 + (i * 10)}s`, 
                animationDirection: i % 2 === 0 ? 'normal' : 'reverse' 
              }}
            >
              {[...fila, ...fila].map((img, index) => (
                <img key={`${i}-${index}`} src={img} className="w-auto h-35 object-cover rounded-xl shadow-md" alt="Trend" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* GRADIENTE */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121015]/20 via-[#121015]/80 to-[#121015]"></div>
      
      {/* CONTENIDO CENTRAL */}
      <div className="relative z-10 text-center px-6 w-full max-w-4xl flex flex-col items-center mt-[-5vh]">
        <h1 className="text-6xl md:text-8xl font-semibold mb-8 text-white tracking-tighter drop-shadow-2xl">
          Music<span className="text-[#4D88FF] drop-shadow-[0_0_25px_rgba(77,136,255,0.4)] font-light">Pedia</span>
        </h1>
        
        {/* BUSCADOR CON SUGERENCIAS */}
        <div className="relative w-full group">
          <form onSubmit={manejarBusqueda} className="flex items-center w-full bg-zinc-900/60 backdrop-blur-xl p-2 rounded-full border border-zinc-700/50 shadow-2xl focus-within:border-[#4D88FF]/50 focus-within:bg-zinc-900/90 transition-all duration-300">
            <input 
              type="text" 
              placeholder={t.descubrirPlaceholder} 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 px-8 py-4 bg-transparent text-white text-xl focus:outline-none placeholder-zinc-300"
            />
            <button type="submit" className="px-10 py-4 bg-[#4D88FF] hover:bg-[#4D88FF]/80 text-white font-bold text-xl rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(77,136,255,0.3)]">
              {t.botonBuscar}
            </button>
          </form>

        {/* DROP DOWN DE SUGERENCIAS */}
          {sugerencias.length > 0 && (
            <ul className="absolute top-[110%] left-0 w-full bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700/50 rounded-3xl overflow-hidden shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {sugerencias.map((item) => {
                // Extraemos el texto y el ID del objeto que nos da la API
                const textoSugerencia = item.artist?.name || "Sugerencia";
                const keyId = item.id || textoSugerencia;

                return (
                  <li key={keyId}>
                    <button 
                      onClick={() => buscarTendencia(textoSugerencia)}
                      className="w-full px-8 py-4 text-left text-white text-lg hover:bg-[#4D88FF]/20 transition-colors flex items-center gap-3"
                    >
                      <span className="text-zinc-300 text-sm">🔍</span> {textoSugerencia}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest mr-2 hidden md:block"> 
            {t.etiquetaTendencias} 
          </span>
          {tendenciasPopulares.map((tendencia) => (
            <button key={tendencia} type="button" onClick={() => buscarTendencia(tendencia)} className="px-5 py-2 rounded-full border border-zinc-300/50 bg-zinc-900/40 text-zinc-300 text-sm font-medium hover:text-white hover:border-[#4D88FF] hover:bg-[#4D88FF]/10 transition-all duration-300 backdrop-blur-sm hover:scale-105">
              {tendencia}
            </button>
          ))}
        </div>
      </div>

      {/* COMPONENTE DE LA CARD CON LA PROP CORRECTA */}
      <TopTrendingCard tracks={topTracks} />

      {/* FOOTER */}
      <div className="absolute bottom-6 z-10 w-full flex flex-col md:flex-row items-center justify-between px-12 text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-300/60 pointer-events-auto">
        <div>© {new Date().getFullYear()} MUSICPEDIA — BY MARINA MATEO</div>
        <div className="flex items-center gap-8">
          <a href="https://www.linkedin.com/in/mmldev/" target="_blank" rel="noopener noreferrer" className="hover:text-[#4D88FF] transition-colors">LinkedIn</a>
          <a href="https://github.com/Marinamlittle" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </section>
  );
}