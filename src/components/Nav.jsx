import { Link } from 'react-router-dom';
import { UserCircle, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';

const Nav = () => {
    const { userProfile, loading } = useAuth();
    
    // Function to get the user's initial for the avatar
    // Safely handles null or empty full_name
    const getUserInitial = () => {
        if (userProfile && userProfile.full_name) {
            return userProfile.full_name.charAt(0).toUpperCase();
        }
        return '';
    };

    const UserAvatar = () => {
        if (loading) {
            // Optional: Show a placeholder during loading
            return <div style={{ width: 24, height: 24 }} className='mx-2'></div>;
        }

        if (userProfile) {
            // LOGGED IN: Show the user's initial in a circle
            const initial = getUserInitial();
            
            return (
                // Link to user profile settings or dashboard
                <Link to="/user-page" className="nav-link p-0 d-flex align-items-center">
                    {/* <p
                        className="d-flex align-items-center justify-content-center mx-2"
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: '#335981ff', // Blue color for contrast
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                        title={userProfile.full_name}
                    >
                        {initial}
                    </p> */}
                    {initial}
                </Link>
            );
        } else {
            // LOGGED OUT: Show the standard UserCircle icon and link to Auth
            return (
                <Link to="/auth" className="nav-link p-0 d-flex align-items-center">
                    <UserCircle className='mx-2' size={24} color="white" /> 
                    {/* Assuming navbar-dark needs a white icon */}
                </Link>
            );
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top shadow">
            <div className="container fluid">
                {/* Brand */}
                <Link className="text-decoration-none" to="/"><span className="navbar-brand">dlp</span></Link>

                {/* Toggler for mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navigation links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center"> {/* Added align-items-center for vertical alignment */}
                        <li className="nav-item">
                            <Link className="nav-link text-decoration-none" to="/link-one">Link One</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-decoration-none" to="/link-two">Link Two</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-decoration-none" to="/link-three">Link Three</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-decoration-none" to="/link-four">Link Four</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-decoration-none" to="/link-five">Link Five</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-decoration-none" to="/link-six">Link Six</Link>
                        </li>
                        
                        {/* Conditional User Avatar */}
                        {/* We use a <li> tag if the avatar should align with other nav items, 
                           but since it's an icon/link already, using the component is cleaner. */}
                        <UserAvatar />
                        
                        {/* Settings Icon (independent of login status) */}
                        <Link to="/instructors-page"className="nav-item">
                            <Settings className='mx-2' size={24} color="white" /> 
                        </Link >
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;