import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Menu, User, BookOpen, Bell } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import NotificationBell from './NotificationBell';

const Nav = () => {
    const { userProfile, loading, logout } = useAuth();
    const navigate = useNavigate(); // Initialize navigation
    
    const getUserInitial = () => {
        if (userProfile?.full_name) return userProfile.full_name.charAt(0).toUpperCase();
        return '?';
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/'); // Send user to main page after successful logout
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm py-2">
            <div className="container">
                {/* Brand */}
                <Link className="navbar-brand fw-bold fs-3 text-uppercase tracking-tighter" to="/">
                    dlp<span className="text-primary">.</span>
                </Link>

                {/* Toggler */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <Menu size={24} color="white" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        {/* Example Links */}
                        <li className="nav-item">
                            <Link className="nav-link px-3" to="/courses">Courses</Link>
                        </li>

                        {/* Vertical Divider */}
                        <div className="vr d-none d-lg-block mx-2 text-white opacity-25" style={{ height: '20px' }}></div>

                        {/* Auth Logic */}
                        {loading ? (
                            <div className="spinner-border spinner-border-sm text-light mx-3" role="status"></div>
                        ) : userProfile ? (
                            <li className="nav-item dropdown">
                                {/* Profile Avatar Toggle */}
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center p-0 no-caret"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div
                                        className="d-flex justify-content-center align-items-center shadow-sm border border-light border-opacity-25 bg-primary text-white fw-bold"
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '50%',
                                            transition: 'transform 0.2s'
                                        }}
                                    >
                                        {getUserInitial()}
                                    </div>
                                </a>
                                <Bell size={24}/><span><NotificationBell/></span>

                                {/* Dropdown Menu */}
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-3 p-2 animate-fade-in" style={{ borderRadius: '12px', minWidth: '200px' }}>
                                    <li className="px-3 py-2 border-bottom mb-2">
                                        <p className="small text-muted mb-0">Signed in as</p>
                                        <p className="fw-bold mb-0 text-dark">{userProfile.full_name}</p>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to="/user-page">
                                            <User size={16} /> My Profile
                                        </Link>
                                    </li>
                                    {userProfile.is_instructor && (
                                        <li>
                                            <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to="/instructors-page">
                                                <BookOpen size={16} /> Instructor Studio
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to="/settings">
                                            <Settings size={16} /> Settings
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2 text-danger"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item">
                                <Link to="/auth" className="btn btn-primary rounded-pill px-4 ms-lg-2 fw-bold shadow-sm">
                                    Sign In
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;