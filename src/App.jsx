import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/screens/LandingPage.jsx';
import Auth from './components/screens/Auth';
import Nav from './components/Nav'; // Assuming this is Nav.jsx
import { AuthProvider } from './components/AuthContext';
import InstructorsPage from './components/screens/InstructorsPage';

function App() {
  return (
    // FIX: Apply top padding to the main container. 
    // The Nav bar is fixed, so this padding ensures the content starts *below* it.
    // Assuming the Nav is about 56px tall, padding-top needs to be > 56px.
    // Using Bootstrap class 'pt-5' (which is usually 3rem or 48px) might be too small.
    // Let's use pt-5 plus a custom style for the extra 2px padding you requested,
    // or just a calculated padding value.
    
    <div 
        className="container-fluid p-0" 
        style={{ paddingTop: '90px' }} // Assuming Nav height is ~56px + 4px gap = 60px
    >
      <AuthProvider>
        {/* Nav component (which uses fixed-top in its own file) */}
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