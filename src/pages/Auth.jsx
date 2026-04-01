import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';
import { LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader2 } from 'lucide-react';

const Auth = () => {
  const { userProfile: user, setUserProfile, getProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isInstructor, setIsInstructor] = useState(false);
  const [error, setError] = useState('');

  const handleRedirect = (profile) => {
    if (profile?.is_instructor) {
      navigate('/instructors-page');
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    if (user) handleRedirect(user);
  }, [user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        // --- LOGIN LOGIC ---
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (loginError) throw loginError;

        const profileData = await getProfile(loginData.user.id);
        setUserProfile(profileData);
        handleRedirect(profileData);
      } else {
        // --- SIGNUP LOGIC (Trigger-based) ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              // The SQL Trigger on your server picks these up automatically
              full_name: fullName,
              is_instructor: isInstructor,
            },
          },
        });

        if (authError) throw authError;

        // Since Email Confirmation is OFF, we get a session immediately
        if (authData.user) {
          const newProfile = {
            id: authData.user.id,
            full_name: fullName,
            is_instructor: isInstructor,
          };
          
          setUserProfile(newProfile);
          handleRedirect(newProfile);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // This ensures that after Google login, it brings the user 
      // back to your local development site
      redirectTo: 'https://elearning-platform-frontend-one.vercel.app/', 
    },
  });
  
  if (error) console.error("Google Login Error:", error.message);
};



  if (user) return null;

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center px-3" style={{ backgroundColor: '#f0f2f5' }}>
      <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: '450px', width: '100%', borderRadius: '20px' }}>
        
        <div className="bg-primary p-5 text-center text-white">
          <h3 className="fw-bold mb-1">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h3>
          <p className="small mb-0 opacity-75">{isLoginMode ? 'Sign in to your dashboard' : 'Join the learning community'}</p>
        </div>
        
        <div className="card-body p-4 p-md-5">
          {error && <div className="alert alert-danger border-0 small mb-4">{error}</div>}
          
          <form onSubmit={handleAuth}>
            {!isLoginMode && (
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">FULL NAME</label>
                <div className="input-group bg-light rounded-3 overflow-hidden border-0">
                  <span className="input-group-text bg-transparent border-0 pe-0 text-muted"><UserIcon size={18} /></span>
                  <input type="text" className="form-control bg-transparent border-0 py-2" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">EMAIL</label>
              <div className="input-group bg-light rounded-3 border-0">
                <span className="input-group-text bg-transparent border-0 pe-0 text-muted"><Mail size={18} /></span>
                <input type="email" className="form-control bg-transparent border-0 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">PASSWORD</label>
              <div className="input-group bg-light rounded-3 border-0">
                <span className="input-group-text bg-transparent border-0 pe-0 text-muted"><Lock size={18} /></span>
                <input type="password" className="form-control bg-transparent border-0 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            {!isLoginMode && (
              <div className="form-check form-switch mb-4 p-3 bg-light rounded-3 border-0 d-flex align-items-center justify-content-between">
                <div>
                  <label className="form-check-label fw-bold small d-block mb-0">Become an Instructor</label>
                </div>
                <input className="form-check-input" type="checkbox" checked={isInstructor} onChange={(e) => setIsInstructor(e.target.checked)} />
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : isLoginMode ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-4">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="btn btn-outline-dark w-100 py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
            >
              <img src="https://www.google.com/favicon.ico" width="16" alt="Google" />
              Continue with Google
            </button>
            <button className="btn btn-link btn-sm text-decoration-none text-muted" onClick={() => setIsLoginMode(!isLoginMode)}>
              {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
      <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Auth;