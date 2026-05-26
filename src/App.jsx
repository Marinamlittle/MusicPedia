import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage'; 
import SearchPage from './pages/SearchPage';
import ArtistPage from './pages/ArtistPage'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search/:termino" element={<SearchPage />} />
      <Route path="/artist/:idArtist" element={<ArtistPage />} />    
    </Routes>
  );
}

export default App;