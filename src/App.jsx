import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Auth from './pages/Auth';
import Nav from './components/Nav';
import Footer from './components/Footer';
import { AuthProvider } from './hooks/AuthContext';
import InstructorsPage from './pages/InstructorsPage';
import UserAccountPage from './pages/UserAccountPage';
import CoursesPage from './pages/CoursesPage';
import SettingsPage from './pages/SettingsPage';
import ContactSupport from './pages/ContactSupport';

function App() {

  useEffect(() => {
    document.body.style.paddingTop = '60px';
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
        <Route path="/courses" element={<CoursesPage/>}/>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<ContactSupport />} />
      </Routes>

      <Footer/>
    </AuthProvider>
  );
}

export default App;
