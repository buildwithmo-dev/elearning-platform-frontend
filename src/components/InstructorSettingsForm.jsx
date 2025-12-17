import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext'; 
import { supabase } from '../services/supabase/supabaseClient';
import { User, ShieldCheck, Save, Loader2 } from 'lucide-react';

export default function InstructorSettingsForm() {
    const { userProfile, setUserProfile } = useAuth();
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.full_name || '');
        }
    }, [userProfile]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            // Use the session user ID directly for security
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) throw new Error("No authenticated user found");

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    full_name: fullName, 
                    updated_at: new Date().toISOString() 
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setUserProfile(prev => ({ ...prev, full_name: fullName }));
            setSuccess(true);
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <h4 className="fw-bold mb-0">Account Settings</h4>
                <p className="text-muted small">Manage your profile information and status.</p>
            </div>

            <div className="card-body p-4 pt-0">
                {/* Profile Header / Avatar Preview */}
                <div className="d-flex align-items-center mb-4 p-3 bg-light rounded-3">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 shadow-sm" style={{ width: '60px', height: '60px' }}>
                        {fullName.charAt(0).toUpperCase() || <User />}
                    </div>
                    <div className="ms-3">
                        <h6 className="mb-1 fw-bold">{fullName || 'User Name'}</h6>
                        <span className="badge bg-primary-soft text-primary rounded-pill" style={{ backgroundColor: '#e7f0ff', fontSize: '11px' }}>
                            {userProfile?.is_instructor ? 'Certified Instructor' : 'Student'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase text-muted">Public Name</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0 text-muted">
                                <User size={18} />
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold small text-uppercase text-muted">Instructor Authorization</label>
                        <div className="p-3 border rounded-3 d-flex align-items-center bg-light opacity-75">
                            <ShieldCheck size={20} className="text-success me-3" />
                            <div>
                                <p className="mb-0 small fw-bold">Verified Instructor Account</p>
                                <p className="mb-0 x-small text-muted">Permission managed by administrator.</p>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                        <button 
                            type="submit" 
                            className="btn btn-primary px-4 d-flex align-items-center gap-2 rounded-pill shadow-sm"
                            disabled={loading}
                        >
                            {loading ? <Loader2 size={18} className="spinner" /> : <Save size={18} />}
                            Save Changes
                        </button>

                        {success && (
                            <span className="text-success small fw-bold animate-fade-in">
                                ✓ Updated successfully
                            </span>
                        )}
                        {error && (
                            <span className="text-danger small">
                                Error: {error}
                            </span>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}