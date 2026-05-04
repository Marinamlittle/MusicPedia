import { createContext, useState } from 'react';

// 1. Aquí pones todas tus traducciones
export const translations = {
  es: {
    inicio: "Inicio",
    generos: "Géneros",
    tendencias: "Tendencias",
    buscar: "Buscar artista...",
    iniciarSesion: "INICIAR SESIÓN",
    enciclopedia: "Enciclopedia Musical",
    descubrirPlaceholder: "¿A quién quieres escuchar hoy?",
    botonBuscar: "Buscar",
    etiquetaTendencias: "Tendencias:"

  },
  en: {
    inicio: "Home",
    generos: "Genres",
    tendencias: "Trending",
    buscar: "Search artist...",
    iniciarSesion: "LOGIN",
    enciclopedia: "Music Encyclopedia",
    descubrirPlaceholder: "Who do you want to listen to today?",
    botonBuscar: "Search",
    etiquetaTendencias: "Trending:"

  }
};

// 2. Creamos el contexto
export const LanguageContext = createContext();

// 3. Este es el proveedor que envolverá tu app
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('es'); // Idioma por defecto

  // Función para alternar el idioma
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  // Obtenemos los textos del idioma actual
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}