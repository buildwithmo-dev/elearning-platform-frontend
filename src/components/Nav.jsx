import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Settings, LogOut, Menu, User, BookOpen, PlayCircle 
} from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import NotificationBell from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';

const Nav = () => {
  const { userProfile, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getUserInitial = () => {
    return userProfile?.full_name?.charAt(0).toUpperCase() || '?';
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur bg-[#020617]/80 border-b border-gray-800">

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          dlp<span className="text-blue-500">.</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/courses" className="text-gray-300 hover:text-white transition">
            Browse Courses
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : userProfile ? (
            <>
              <NotificationBell />

              {/* Avatar */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center hover:scale-105 transition"
                >
                  {getUserInitial()}
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                    >

                      <div className="px-4 py-3 border-b">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {userProfile.full_name}
                        </p>
                      </div>

                      <div className="p-2 space-y-1 text-sm">

                        <Link
                          to="/my-courses"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          <PlayCircle size={16} className="text-blue-500" />
                          My Learning
                        </Link>

                        <Link
                          to="/user-page"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          <User size={16} />
                          Profile
                        </Link>

                        {userProfile.is_instructor && (
                          <Link
                            to="/instructors-page"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                          >
                            <BookOpen size={16} />
                            Instructor Studio
                          </Link>
                        )}

                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                        >
                          <Settings size={16} />
                          Settings
                        </Link>

                        <div className="border-t my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-red-500 hover:bg-red-50"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full font-semibold shadow-md transition"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden bg-[#020617] border-t border-gray-800 px-4 py-4"
          >
            <Link
              to="/courses"
              className="block py-2 text-gray-300 hover:text-white"
            >
              Browse Courses
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Nav;