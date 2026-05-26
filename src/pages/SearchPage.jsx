import { useParams } from 'react-router-dom';
import Navbar from '../components/navbar';
import ArtistCard from '../components/ArtistCard';
import { useArtist } from '../hooks/useArtist';

export default function SearchPage() {
  // 1. useParams "atrapa" la palabra de la URL 
  const { termino } = useParams(); 

  // 2. Le pasamos esa palabra a tu custom hook para que llame a la API
  const { data, loading, error } = useArtist(termino);

  console.log('Datos recibidos:', data);

  return (
    <div className="bg-zinc-950 min-h-screen text-white">
      <Navbar />   

      <main className="p-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center">
          Resultados para: <span className="text-indigo-400">"{termino}"</span>
        </h1>

        {/* Mientras carga */}
        {loading && (
          <div className="flex flex-col items-center mt-10">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-400 text-lg">Buscando en la base de datos...</p>
          </div>
        )}

        {/* Si hay un error (ej. escribes un nombre que no existe) */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl text-center mt-10">
            <p className="text-red-500 text-xl font-bold mb-2">¡Ups!</p>
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Si encuentra datos, recorremos la lista con .map() */}
        {data && !loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl place-items-center mt-10">
            {data.map((artista) => (
              <ArtistCard 
                key={artista.idArtist}
                idArtist={artista.idArtist}
                strArtist={artista.strArtist}
                strArtistThumb={artista.strArtistThumb}
                strGenre={artista.strGenre}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}