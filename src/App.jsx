import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CrewPage from './pages/CrewPage';
import KvaPage from './pages/KvaPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/crew" element={<CrewPage />} />
        <Route path="/kva" element={<KvaPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
