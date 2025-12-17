import { Link } from 'react-router-dom';
import { UserCircle, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

const Nav = () => {
    const { userProfile, loading, logout } = useAuth();
    
    const getUserInitial = () => {
        if (userProfile?.full_name) return userProfile.full_name.charAt(0).toUpperCase();
        return '';
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top shadow">
            <div className="container-fluid">
                {/* Brand */}
                <Link className="text-decoration-none" to="/">
                    <span className="navbar-brand">dlp</span>
                </Link>

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
                    <ul className="navbar-nav ms-auto align-items-center">
                        {["one","two","three","four","five","six"].map((link,i)=>(
                            <li className="nav-item" key={i}>
                                <Link className="nav-link text-decoration-none" to={`/link-${link}`}>
                                    Link {link.charAt(0).toUpperCase()+link.slice(1)}
                                </Link>
                            </li>
                        ))}

                        {/* User Avatar */}
                        <li className="nav-item">
                            {loading ? (
                                <div style={{ width: 24, height: 24, marginLeft: 8 }}></div>
                            ) : userProfile ? (
                                <Link to="/user-page" className="nav-link d-flex align-items-center">
                                    <span
                                        className="d-flex justify-content-center align-items-center"
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: '#335981ff',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '14px'
                                        }}
                                        title={userProfile.full_name}
                                    >
                                        {getUserInitial()}
                                    </span>
                                </Link>
                            ) : (
                                <Link to="/auth" className="nav-link">
                                    <UserCircle size={24} color="white" />
                                </Link>
                            )}
                        </li>

                        {/* Settings Icon */}
                        <li className="nav-item">
                            <Link to="/instructors-page" className="nav-link">
                                <Settings size={24} color="white" />
                            </Link>
                        </li>

                        {/* Sign Out */}
                        {userProfile && (
                        <li className="nav-item">
                            <button
                            className="btn nav-link"
                            style={{ background: 'none', border: 'none', padding: 0 }}
                            title="Sign Out"
                            onClick={logout}
                            >
                            <LogOut size={24} color="white" />
                            </button>
                        </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
