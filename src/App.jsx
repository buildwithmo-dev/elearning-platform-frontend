import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Auth from './pages/Auth';
import Nav from './components/Nav';
import { AuthProvider } from './hooks/AuthContext';
import InstructorsPage from './pages/InstructorsPage';
import UserAccountPage from './pages/UserAccountPage';

function App() {

  useEffect(() => {
    document.body.style.paddingTop = '60px'; // MUST match navbar height
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, []);

  return (
    <AuthProvider>
      <Nav />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/instructors-page" element={<InstructorsPage />} />
        <Route path="/user-page" element={<UserAccountPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
