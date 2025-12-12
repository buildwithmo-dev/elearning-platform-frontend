import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/screens/LandingPage.jsx';
import Auth from './components/screens/Auth';
import Nav from './components/Nav';
import { AuthProvider } from './components/AuthContext';
import InstructorsPage from './components/screens/InstructorsPage';
function App() {
  return (
    <div className="container-fluid">
      <AuthProvider>
        {/* Nav should be on all pages */}
        <Nav />

        {/* Routes decide which main content to show */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/link-one" element={<div>Link One Page</div>} />
          <Route path="/link-two" element={<div>Link Two Page</div>} />
          <Route path="/link-three" element={<div>Link Three Page</div>} />
          <Route path="/link-four" element={<div>Link Four Page</div>} />
          <Route path="/link-five" element={<div>Link Five Page</div>} />
          <Route path="/link-six" element={<div>Link Six Page</div>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/instructors-page" element={<InstructorsPage/>}/>
        </Routes>
      </AuthProvider>
      
    </div>
  );
}

export default App;
