import React, { useState } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext'; 

const Auth = () => {
  // Use the context for user profile management and helpers
  // We alias userProfile to 'user' for cleaner JSX usage
  const { userProfile: user, setUserProfile, getProfile } = useAuth();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [isInstructor, setIsInstructor] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');
    try {
      // 1. Sign up user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;
      
      const newProfile = {
        id: authData.user.id, 
        full_name: fullName,
        is_instructor: isInstructor,
      };

      // 2. Insert profile linked to auth user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([newProfile]);
      if (profileError) throw profileError;

      // 3. Set global user state using the context
      setUserProfile(newProfile); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = async () => {
    setError('');
    try {
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;

      // Fetch profile for the authenticated user using the helper from context
      const profileData = await getProfile(loginData.user.id);

      if (!profileData) {
        setError('Profile not found. Please sign up first.');
        return;
      }

      // Set global user state using the context
      setUserProfile(profileData);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    setError('');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Clear global user state using the context
      setUserProfile(null); 
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(248, 249, 250, 0.9)',
        zIndex: 1000,
      }}
    >
      <div
        className="card shadow"
        style={{ maxWidth: '500px', width: '90%', padding: '10px 0' }}
      >
        <div className="card-body">
          <h3 className="card-title text-center mb-4">
            {user ? `Welcome, ${user.full_name}` : 'Login / Signup'}
          </h3>

          {!user && (
            <form>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="instructorCheck"
                  checked={isInstructor}
                  onChange={(e) => setIsInstructor(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="instructorCheck">
                  Instructor
                </label>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSignup}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </div>
            </form>
          )}

          {user && (
            <div className="text-center mt-4">
              <p className="text-success">
                You are logged in as {user.is_instructor ? 'Instructor' : 'Student'}.
              </p>
              <button
                type="button"
                className="btn btn-danger mt-3"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;