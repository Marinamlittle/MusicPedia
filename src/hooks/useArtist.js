import { useState, useEffect } from 'react';
import { searchTracks } from '../services/deezerApi';

export const useArtist = (termino) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 1. Buscamos en Deezer
        const resultados = await searchTracks(termino);
        const arrayResultados = Array.isArray(resultados) ? resultados : (resultados?.data || []);
        
        if (arrayResultados.length === 0) {
          setError(`No encontramos artistas para "${termino}".`);
          setLoading(false);
          return;
        }

        // 2. Extraemos artistas únicos y filtramos por nombre exacto
        const artistasVistos = new Set();
        const artistasUnicos = [];

        for (const item of arrayResultados) {
          const artistaInfo = item.artist;
          
          if (artistaInfo && !artistasVistos.has(artistaInfo.id)) {
            
            // FILTRO ESTRICTO
            const nombreArtista = artistaInfo.name.toLowerCase();
            const busqueda = termino.toLowerCase();

            if (nombreArtista.includes(busqueda)) {
              artistasVistos.add(artistaInfo.id);
              
              // 3. Mapeamos los datos para la ArtistCard
              artistasUnicos.push({
                idArtist: artistaInfo.id,
                strArtist: artistaInfo.name,
                strArtistThumb: artistaInfo.picture_medium || artistaInfo.picture, 
                strGenre: "Artista" 
              });
            }
          }
        }

        // Si después de filtrar no queda ningún artista que coincida exactamente
        if (artistasUnicos.length === 0) {
          setError(`No encontramos artistas que se llamen exactamente "${termino}".`);
        } else {
          setData(artistasUnicos);
        }

      } catch (err) {
        console.error("Error en useArtist:", err);
        setError("Hubo un error al conectar con la base de datos.");
      } finally {
        setLoading(false);
      }
    };

    if (termino) {
      fetchArtists();
    }
  }, [termino]);

  return { data, loading, error };
};