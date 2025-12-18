import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Menu, User, BookOpen, PlayCircle } from 'lucide-react'; // Added PlayCircle icon
import { useAuth } from '../hooks/AuthContext';
import NotificationBell from './NotificationBell';

const Nav = () => {
    const { userProfile, loading, logout } = useAuth();
    const navigate = useNavigate();
    
    const getUserInitial = () => {
        if (userProfile?.full_name) return userProfile.full_name.charAt(0).toUpperCase();
        return '?';
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow-sm py-2">
            <div className="container d-flex align-items-center">
                
                {/* --- Left: Logo & Menu Toggler --- */}
                <div className="d-flex align-items-center me-auto">
                    <button
                        className="navbar-toggler border-0 p-0 me-3"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <Menu size={24} color="white" />
                    </button>
                    <Link className="navbar-brand fw-bold fs-3 text-uppercase m-0" to="/">
                        dlp<span className="text-primary">.</span>
                    </Link>
                </div>

                {/* --- Center: Collapsible Menu --- */}
                <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link px-3 fw-medium" to="/courses">Browse Courses</Link>
                        </li>
                    </ul>
                </div>

                {/* --- Right: Action Icons (Always Visible) --- */}
                <div className="d-flex align-items-center gap-2 gap-md-3 ms-auto">
                    {loading ? (
                        <div className="spinner-border spinner-border-sm text-light" role="status"></div>
                    ) : userProfile ? (
                        <>
                            <NotificationBell />

                            <div className="dropdown">
                                <a
                                    className="d-flex align-items-center p-0 no-caret"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="d-flex justify-content-center align-items-center border border-light border-opacity-25 bg-primary text-white fw-bold shadow-sm user-avatar">
                                        {getUserInitial()}
                                    </div>
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-3 p-2 animate-fade-in">
                                    <li className="px-3 py-2 border-bottom mb-2">
                                        <p className="small text-muted mb-0">Signed in as</p>
                                        <p className="fw-bold mb-0 text-dark text-truncate" style={{ maxWidth: '180px' }}>
                                            {userProfile.full_name}
                                        </p>
                                    </li>

                                    {/* STUDENT TAB: My Courses */}
                                    <li>
                                        <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to="/my-courses">
                                            <PlayCircle size={16} className="text-primary" /> 
                                            <span className="fw-medium">My Learning</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2" to="/user-page">
                                            <User size={16} /> Profile
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

                                    <li><hr className="dropdown-divider opacity-10" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item rounded-3 d-flex align-items-center gap-2 py-2 text-danger"
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <Link to="/auth" className="btn btn-primary btn-sm rounded-pill px-4 fw-bold shadow-sm">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>

            <style>{`
                .no-caret::after { display: none !important; }
                .user-avatar { width: 35px; height: 35px; border-radius: 50%; font-size: 0.85rem; transition: all 0.2s; }
                .user-avatar:hover { transform: scale(1.05); filter: brightness(1.1); }
                
                @media (max-width: 991.98px) {
                    .navbar-collapse {
                        position: absolute;
                        top: 100%; left: 0; right: 0;
                        background-color: #212529;
                        padding: 1.5rem;
                        z-index: 1000;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        box-shadow: 0 10px 15px rgba(0,0,0,0.3);
                    }
                }
                .dropdown-menu { border-radius: 14px; min-width: 220px; border: 1px solid rgba(0,0,0,0.05) !important; }
                .animate-fade-in { animation: fadeIn 0.2s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </nav>
    );
};

export default Nav;