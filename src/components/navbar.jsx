import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { LanguageContext } from '../context/LanguageContext';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState('');
  const [menuIdiomaAbierto, setMenuIdiomaAbierto] = useState(false); 

  const { language, toggleLanguage, t } = useContext(LanguageContext);
  
  const navigate = useNavigate();

  const cerrarMenu = () => setMenuAbierto(false);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (textoBusqueda.trim() !== '') {
      navigate(`/search/${textoBusqueda}`);
      setBuscadorAbierto(false);
      setTextoBusqueda('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#121015] border-b border-zinc-800/50 backdrop-blur-xl h-25 flex items-center px-8">
      
      {/* CONTENEDOR PRINCIPAL */}
      <div className="w-full flex items-center justify-between ">
        
        {/* === SECCIÓN IZQUIERDA: LOGOTIPO === */}
        <Link 
          to="/" 
          onClick={cerrarMenu}
          className="flex items-center gap-3 group decoration-transparent md:ml-16 lg:ml-24"
        >
          {/* LOGO */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-[#89888A] group-hover:text-[#4D88FF] group-hover:scale-110 transition-all duration-300">
            <path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>
          </svg>
          
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-white group-hover:text-zinc-300 transition-all duration-300 tracking-widest group-hover:tracking-[0.11em] leading-none">     
              Music
              <span className=" text-2xl font-semibold text-[#4D88FF] group-hover:text-gray-400 transition-colors duration-900">Pedia</span>
            </h2>        
          </div>
        </Link>

        {/* === SECCIÓN DERECHA === */}
        <div className="flex items-center gap-6 md:gap-8 md:pr-40">
          
          {/* 1. EL BUSCADOR  */}
          <div className=" flex md:hidden items-center ">
            <form 
              onSubmit={manejarBusqueda} 
              className={`overflow-hidden transition-all duration-300 ease-in-out flex items-center ${
                buscadorAbierto ? 'w-40 md:w-64 opacity-100 mr-2' : 'w-0 opacity-0'
              }`}
            >
              <input 
                type="text" 
                placeholder={t.buscar}
                value={textoBusqueda}
                onChange={(e) => setTextoBusqueda(e.target.value)}
                className="w-full bg-zinc-900/50 text-white text-sm px-4 py-2 rounded-full border border-zinc-700/50 focus:outline-none focus:border-[#4D88FF] focus:bg-zinc-900 transition-all duration-300"
                autoFocus={buscadorAbierto}
              />
            </form>

            <button 
              onClick={() => setBuscadorAbierto(!buscadorAbierto)}
              className="text-white hover:text-[#4D88FF] hover:-translate-y-1 transition-all duration-300 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>

          {/* 2. CAMBIO DE IDIOMA  */}
          <div className="relative hidden md:block">
            {/* Botón principal */}
            <div 
              onClick={() => setMenuIdiomaAbierto(!menuIdiomaAbierto)} 
              className="flex items-center gap-1 text-sm font-bold text-white bg-white/5 hover:bg-[#4D88FF]/10 hover:text-[#4D88FF] px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(77,136,255,0.15)] border border-white/5 hover:border-[#4D88FF]/30"
            >
              <span>{language === 'es' ? 'ES' : 'EN'}</span> 
              <svg className={`w-4 h-4 transition-transform duration-300 ${menuIdiomaAbierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            {/* El cajetín desplegable con Banderas */}
            {menuIdiomaAbierto && (
              <div className="absolute top-full right-0 mt-6 w-40 bg-[#121015]/95 backdrop-blur-md border border-zinc-800/80 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] flex flex-col overflow-hidden py-2 z-50">
                <button 
                  onClick={() => { 
                    if(language !== 'es') toggleLanguage(); 
                    setMenuIdiomaAbierto(false); 
                  }}
                  className={`px-4 py-3 text-sm flex items-center justify-between font-bold tracking-wider transition-colors ${language === 'es' ? 'text-[#4D88FF] bg-zinc-900/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                >
                  <span>ESPAÑOL</span>
                  <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-5 h-auto rounded-[2px] opacity-90" />
                </button>
                
                <button 
                  onClick={() => { 
                    if(language !== 'en') toggleLanguage(); 
                    setMenuIdiomaAbierto(false); 
                  }}
                  className={`px-4 py-3 text-sm flex items-center justify-between font-bold tracking-wider transition-colors ${language === 'en' ? 'text-[#4D88FF] bg-zinc-900/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                >
                  <span>ENGLISH</span>
                  <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-auto rounded-[2px] opacity-90" />
                </button>
              </div>
            )}
          </div>

          {/* 3. INICIAR SESIÓN (Solo PC) */}
          <div className="hidden md:flex items-center gap-2 text-sm font-bold text-white bg-white/5 hover:bg-[#4D88FF]/10 hover:text-[#4D88FF] px-5 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(77,136,255,0.15)] border border-white/5 hover:border-[#4D88FF]/30">            
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span className="uppercase tracking-wider font-semibold">{t.iniciarSesion}</span>
          </div>

          {/* 4. MENÚ HAMBURGUESA (Solo Móvil) */}
          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden text-white focus:outline-none hover:text-[#4D88FF] hover:-translate-y-1 transition-all duration-300 p-1"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAbierto ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {menuAbierto && (
        <div className="absolute top-[100%] left-0 w-full bg-[#121015] border-t border-zinc-800 flex flex-col items-center py-8 gap-8 md:hidden shadow-2xl z-50">
          
          {/* Textos del menú móvil con traducción */}
          <Link to="/" onClick={cerrarMenu} className="text-white text-xl font-bold uppercase tracking-widest hover:text-[#4D88FF] transition-colors">{t.inicio}</Link>
          <Link to="/genre" onClick={cerrarMenu} className="text-neutral-400 text-xl font-bold uppercase tracking-widest hover:text-white transition-colors">{t.generos}</Link>
          <Link to="/tend" onClick={cerrarMenu} className="text-neutral-400 text-xl font-bold uppercase tracking-widest hover:text-white transition-colors">{t.tendencias}</Link>
          
          <div className="w-16 h-px bg-zinc-800 my-2"></div> 
          
          <div className="flex items-center gap-2 text-white font-bold tracking-widest uppercase cursor-pointer hover:text-[#4D88FF] transition-colors">
            <span>{t.iniciarSesion}</span>
          </div>
          
          {/* DESPLEGABLE DE IDIOMA PARA MÓVIL */}
          <div className="flex flex-col items-center w-full">
            <div 
              onClick={() => setMenuIdiomaAbierto(!menuIdiomaAbierto)} 
              className="flex items-center gap-2 text-[#4D88FF] font-bold tracking-widest uppercase cursor-pointer"
            >
               <span>IDIOMA: {language === 'es' ? 'ESPAÑOL' : 'ENGLISH'}</span>
               <svg className={`w-5 h-5 transition-transform duration-300 ${menuIdiomaAbierto ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>

            {/* Sub-menú de idiomas que se expande hacia abajo */}
            {menuIdiomaAbierto && (
              <div className="mt-4 flex flex-col items-center gap-4 bg-zinc-900/50 w-3/4 py-4 rounded-xl border border-zinc-800/50">
                <button 
                  onClick={() => { 
                    if(language !== 'es') toggleLanguage(); 
                    setMenuIdiomaAbierto(false);
                    cerrarMenu(); // Cerramos todo el menú móvil al elegir
                  }}
                  className={`flex items-center justify-between w-32 px-4 py-2 rounded-lg font-bold tracking-wider transition-colors ${language === 'es' ? 'text-[#4D88FF] bg-[#121015]' : 'text-zinc-400 hover:text-white'}`}
                >
                  <span>ESPAÑOL</span>
                  <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-5 h-auto rounded-[2px]" />
                </button>
                
                <button 
                  onClick={() => { 
                    if(language !== 'en') toggleLanguage(); 
                    setMenuIdiomaAbierto(false);
                    cerrarMenu(); // Cerramos todo el menú móvil al elegir
                  }}
                  className={`flex items-center justify-between w-32 px-4 py-2 rounded-lg font-bold tracking-wider transition-colors ${language === 'en' ? 'text-[#4D88FF] bg-[#121015]' : 'text-zinc-400 hover:text-white'}`}
                >
                  <span>ENGLISH</span>
                  <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-5 h-auto rounded-[2px]" />
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </nav>
  );
}