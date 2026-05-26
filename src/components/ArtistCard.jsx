import { Link } from 'react-router-dom';

const ArtistCard = ({ idArtist, strArtist, strArtistThumb, strGenre }) => {
  // Si no hay foto, ponemos una de relleno para que no se rompa el diseño
  const imagenMostrar = strArtistThumb || 'https://via.placeholder.com/300x300?text=Sin+Foto';

  return (
    <Link 
      // ¡EL CAMBIO ESTÁ AQUÍ ABAJO! 
      // Ahora usamos idArtist en lugar de strArtist
      to={`/artist/${idArtist}`} 
      className="group flex flex-col items-center bg-zinc-800/50 p-6 rounded-2xl hover:bg-zinc-800 transition-all duration-300 hover:-translate-y-2 cursor-pointer w-full max-w-[250px]"
    >
      {/* Contenedor de la foto (Circular y con efecto hover) */}
      <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full mb-4 border-4 border-transparent group-hover:border-indigo-500 transition-colors duration-300">
        <img 
          src={imagenMostrar} 
          alt={`Foto de ${strArtist}`} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nombre del artista */}
      <h3 className="text-xl font-bold text-white text-center group-hover:text-indigo-400 transition-colors line-clamp-1">
        {strArtist}
      </h3>
      
      {/* Género musical (si existe) */}
      {strGenre && (
        <p className="text-zinc-400 text-sm mt-1 text-center">
          {strGenre}
        </p>
      )}
    </Link>
  );
};

export default ArtistCard;