import { Link } from 'react-router-dom';
import { UserCircle, Settings } from 'lucide-react';

const Nav = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary fixed-top shadow">
            <div className="container">
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
                    <ul className="navbar-nav ms-auto">
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
                        <Link to="/auth">
                            <UserCircle className='mx-2' size={24} color="black" />
                        </Link>
                        <Settings className='mx-2' size={24}/>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Nav;
