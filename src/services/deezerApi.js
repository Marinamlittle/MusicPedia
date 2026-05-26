
export const getTopTracks = async () => {
  try {
    const response = await fetch('/deezer/chart/0/tracks');
    
    if (!response.ok) throw new Error('Respuesta no exitosa de la API');
    
    const result = await response.json();
    return result.data; 
  } catch (error) {
    console.error("Fallo al conectar con Deezer:", error);
    return [];
  }
};
  
export const searchTracks = async (query) => {
  try {
    // CAMBIO IMPORTANTE: Usamos el endpoint de búsqueda y le pasamos el texto
    const response = await fetch(`/deezer/search?q=${encodeURIComponent(query)}`);
    
    if (!response.ok) throw new Error('Respuesta no exitosa al buscar en la API');

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error buscando canciones:", error);
    return [];
  }
};
//ARTISTPAGE

//ARTISTPAGE

// 1. Obtener detalles del artista por ID
export const getArtistDetails = async (artistId) => {
  try {
    // CAMBIO: Ahora usamos /deezer para que el proxy lo detecte
    const response = await fetch(`/deezer/artist/${artistId}`); 
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo detalles del artista:", error);
    return null;
  }
};

// 2. Obtener álbumes del artista
export const getArtistAlbums = async (artistId) => {
  try {
    const response = await fetch(`/deezer/artist/${artistId}/albums`);
    const data = await response.json();
    return data.data || []; 
  } catch (error) {
    console.error("Error obteniendo álbumes:", error);
    return [];
  }
};

// 3. Obtener el Top canciones (para calcular popularidad de hitos)
export const getArtistTopTracks = async (artistId) => {
  try {
    const response = await fetch(`/deezer/artist/${artistId}/top?limit=5`);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error obteniendo top tracks:", error);
    return [];
  }
};


export const getArtistBioFromAudioDB = async (artistName) => {
  try {
    // Usamos la API pública de TheAudioDB para buscar por texto
    const response = await fetch(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(artistName)}`);
    const data = await response.json();
    
    // Si encuentra al artista, devolvemos el primero de la lista. Si no, null.
    return data.artists ? data.artists[0] : null;
  } catch (error) {
    console.error("Error buscando biografía en TheAudioDB:", error);
    return null;
  }
};