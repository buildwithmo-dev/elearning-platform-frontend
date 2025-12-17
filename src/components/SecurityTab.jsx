import React, { useState } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';
import { Lock, Smartphone, ShieldAlert, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export default function SecurityTab() {
    const { userProfile } = useAuth();
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Update Password Logic
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        
        if (error) setStatus({ type: 'danger', msg: error.message });
        else {
            setStatus({ type: 'success', msg: 'Password updated successfully!' });
            setPassword('');
        }
        setLoading(false);
    };

    // Account Deletion Logic
    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            // 1. Delete public profile (Trigger/RLS handles this)
            const { error } = await supabase.from('profiles').delete().eq('id', userProfile.id);
            if (error) throw error;

            // 2. Sign out
            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (err) {
            setStatus({ type: 'danger', msg: "Error deleting account. Contact support." });
            setShowDeleteModal(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h5 className="fw-bold mb-1">Login & Security</h5>
            <p className="text-muted small mb-4">Manage your credentials and account safety.</p>

            {status && (
                <div className={`alert alert-${status.type} border-0 small d-flex align-items-center gap-2 mb-4 shadow-sm`}>
                    {status.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {status.msg}
                </div>
            )}

            <div className="row g-4">
                <div className="col-md-7">
                    {/* Password Change Card */}
                    <form onSubmit={handleUpdatePassword} className="card border-0 bg-light p-4 rounded-4 mb-4">
                        <label className="form-label small fw-bold text-muted">CHANGE PASSWORD</label>
                        <div className="input-group bg-white rounded-3 border mb-3">
                            <span className="input-group-text bg-transparent border-0"><Lock size={18} className="text-muted"/></span>
                            <input 
                                type="password" 
                                className="form-control border-0 py-2" 
                                placeholder="New password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                        <button className="btn btn-primary rounded-pill px-4 fw-bold w-auto shadow-sm" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                        </button>
                    </form>

                    {/* Phone Security Card */}
                    <div className="card border-0 bg-light p-4 rounded-4">
                        <div className="d-flex align-items-center gap-3 mb-3">
                            <div className="bg-white p-2 rounded-3 shadow-sm text-primary">
                                <Smartphone size={20} />
                            </div>
                            <h6 className="fw-bold mb-0">Two-Factor Authentication</h6>
                        </div>
                        <p className="small text-muted mb-3">Secure your account by adding a mobile number for SMS verification codes.</p>
                        <div className="input-group bg-white rounded-3 border mb-3">
                            <input 
                                type="tel" 
                                className="form-control border-0 py-2" 
                                placeholder="+233 XXX XXX XXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-outline-dark rounded-pill px-4 btn-sm fw-bold">Link Phone</button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="col-12 mt-4">
                    <div className="card border-danger border-opacity-25 bg-danger bg-opacity-10 p-4 rounded-4">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div>
                                <h6 className="fw-bold text-danger mb-1 d-flex align-items-center gap-2">
                                    <ShieldAlert size={18}/> Danger Zone
                                </h6>
                                <p className="small text-muted mb-0">Once you delete your account, all your data will be permanently removed.</p>
                            </div>
                            <button onClick={() => setShowDeleteModal(true)} className="btn btn-danger rounded-pill px-4 fw-bold">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deletion Modal */}
            {showDeleteModal && (
                <div className="modal-backdrop bg-dark bg-opacity-50 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
                    <div className="bg-white p-4 rounded-4 shadow-lg mx-3 w-100" style={{ maxWidth: '400px' }}>
                        <h5 className="fw-bold text-danger mb-3">Final Confirmation</h5>
                        <p className="text-muted small mb-4">Are you sure? This will remove all course progress and profile data. You cannot undo this.</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light flex-grow-1 rounded-pill fw-bold" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                            <button className="btn btn-danger flex-grow-1 rounded-pill fw-bold" onClick={handleDeleteAccount} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}