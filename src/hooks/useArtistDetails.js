import { useState, useEffect } from 'react';
import { getArtistDetails, getArtistAlbums, getArtistTopTracks, getArtistBioFromAudioDB } from '../services/deezerApi'; 

export const useArtistDetails = (artistId) => {
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [bio, setBio] = useState(null); // ESTADO PARA THEAUDIODB
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!artistId) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Pedimos la música a Deezer
        const [artistData, albumsData, topTracksData] = await Promise.all([
          getArtistDetails(artistId),
          getArtistAlbums(artistId),
          getArtistTopTracks(artistId)
        ]);

        if (artistData && !artistData.error) {
          setArtist(artistData);
          setAlbums(albumsData);
          setTopTracks(topTracksData);

          // 2. MAGIA: Con el nombre de Deezer, pedimos la bio a TheAudioDB
          if (artistData.name) {
            const bioData = await getArtistBioFromAudioDB(artistData.name);
            setBio(bioData);
          }
        } else {
          setError("No se pudo encontrar la información de este artista.");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [artistId]);

  // Devolvemos la variable "bio" también
  return { artist, albums, topTracks, bio, loading, error };
};