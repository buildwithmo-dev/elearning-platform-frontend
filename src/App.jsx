import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/screens/LandingPage.jsx';
import Auth from './components/screens/Auth';
import Nav from './components/Nav';
import { AuthProvider } from './components/AuthContext';
import InstructorsPage from './components/screens/InstructorsPage';
import UserPage from './components/screens/UserPage';

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
        <Route path="/user-page" element={<UserPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
