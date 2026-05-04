// src/services/deezerApi.js
export const getTopTracks = async () => {
    try {
      // AHORA LLAMAMOS A /deezer DIRECTAMENTE
      const response = await fetch('/deezer/chart/0/tracks');
      
      if (!response.ok) throw new Error('Respuesta no exitosa de la API');
      
      const result = await response.json();
      return result.data; 
    } catch (error) {
      console.error("Fallo al conectar con Deezer:", error);
      return [];
    }
  };