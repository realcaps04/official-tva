import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CrewPage from './pages/CrewPage';
import KvaPage from './pages/KvaPage';
import HighlightsPage from './pages/HighlightsPage';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import OurStuffPage from './pages/OurStuffPage';
import SupportPage from './pages/SupportPage';
import AdminPage from './pages/AdminPage';

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crew" element={<CrewPage />} />
        <Route path="/kva" element={<KvaPage />} />
        <Route path="/highlights" element={<HighlightsPage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/our-stuff" element={<OurStuffPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}

export default App;
