import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';
import { User, Mail, ShieldCheck, CheckCircle, Loader2, Camera } from 'lucide-react';

export default function ProfileTab() {
    const { userProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // State for form fields
    const [fullName, setFullName] = useState('');

    // Sync local state when userProfile loads
    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.full_name || '');
        }
    }, [userProfile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    full_name: fullName,
                    updated_at: new Date() 
                })
                .eq('id', userProfile.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Hide success message after 3 seconds
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'danger', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h5 className="fw-bold mb-1">Public Profile</h5>
            <p className="text-muted small mb-4">This information will be visible to instructors and other students.</p>

            {message.text && (
                <div className={`alert alert-${message.type} border-0 small d-flex align-items-center gap-2 mb-4 shadow-sm`}>
                    <CheckCircle size={16} /> {message.text}
                </div>
            )}

            <div className="row g-4">
                {/* Profile Photo Section (UI Placeholder) */}
                <div className="col-md-4 text-center border-end">
                    <div className="position-relative d-inline-block mb-3">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px' }}>
                            <User size={60} className="text-primary" />
                        </div>
                        <button className="btn btn-sm btn-white border shadow-sm rounded-circle position-absolute bottom-0 end-0 p-2">
                            <Camera size={14} />
                        </button>
                    </div>
                    <h6 className="fw-bold mb-0">{userProfile?.full_name}</h6>
                    <span className="badge bg-light text-dark border mt-2 px-3 py-2 rounded-pill small">
                        {userProfile?.is_instructor ? 'Instructor' : 'Student Account'}
                    </span>
                </div>

                {/* Profile Form */}
                <div className="col-md-8">
                    <form onSubmit={handleUpdateProfile}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">FULL NAME</label>
                            <div className="input-group bg-light rounded-3 border-0">
                                <span className="input-group-text bg-transparent border-0"><User size={18} className="text-muted"/></span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-0 py-2" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-muted">EMAIL ADDRESS (Read Only)</label>
                            <div className="input-group bg-light rounded-3 border-0 opacity-75">
                                <span className="input-group-text bg-transparent border-0"><Mail size={18} className="text-muted"/></span>
                                <input 
                                    type="email" 
                                    className="form-control bg-transparent border-0 py-2" 
                                    value={userProfile?.email || 'N/A'} 
                                    disabled
                                />
                                <span className="input-group-text bg-transparent border-0 text-success"><ShieldCheck size={18}/></span>
                            </div>
                        </div>

                        <button className="btn btn-primary rounded-pill px-5 fw-bold shadow-sm" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </div>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}