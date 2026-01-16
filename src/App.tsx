import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';       // Halaman LOBBY (Menu Utama)
import Explore from './pages/Explore';   // Halaman ALAM GAIB (Hutan)
import City from './pages/City';         // Halaman KOTA (Baru)

function App() {
  return (
    <Router>
      <Routes>
        {/* Menu Utama (Lobby) */}
        <Route path="/" element={<Index />} />
        
        {/* Level 1: Kota Karawang */}
        <Route path="/city" element={<City />} />
        
        {/* Level 2: Alam Gaib */}
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </Router>
  );
}

export default App;