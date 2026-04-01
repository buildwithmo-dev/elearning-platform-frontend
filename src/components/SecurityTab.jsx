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

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setStatus({ type: 'error', msg: error.message });
        } else {
            setStatus({ type: 'success', msg: 'Password updated successfully!' });
            setPassword('');
        }

        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').delete().eq('id', userProfile.id);
            if (error) throw error;

            await supabase.auth.signOut();
            window.location.href = '/';
        } catch (err) {
            setStatus({ type: 'error', msg: 'Error deleting account. Contact support.' });
            setShowDeleteModal(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Login & Security</h2>
                <p className="text-gray-500 text-sm">Manage your credentials and account safety.</p>
            </div>

            {/* Status */}
            {status && (
                <div className={`mb-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium
                    ${status.type === 'success'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'}`}>
                    {status.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                    {status.msg}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                
                {/* LEFT COLUMN */}
                <div className="space-y-6">

                    {/* Password Card */}
                    <form onSubmit={handleUpdatePassword} className="bg-white border rounded-2xl p-6 shadow-sm">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Change Password</label>

                        <div className="mt-3 flex items-center border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                            <Lock size={18} className="text-gray-400 mr-2" />
                            <input
                                type="password"
                                placeholder="New password (min 6 chars)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full outline-none text-sm"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            className="mt-4 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Update Password'}
                        </button>
                    </form>

                    {/* 2FA Card */}
                    <div className="bg-white border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Smartphone size={18} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Two-Factor Authentication</h3>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Add your phone number for extra account protection.
                        </p>

                        <div className="flex items-center border rounded-xl px-3 py-2 mb-3 focus-within:ring-2 focus-within:ring-blue-500">
                            <input
                                type="tel"
                                placeholder="+233 XXX XXX XXX"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full outline-none text-sm"
                            />
                        </div>

                        <button className="text-sm font-semibold px-4 py-2 border rounded-full hover:bg-gray-50 transition">
                            Link Phone
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div>
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h3 className="flex items-center gap-2 text-red-600 font-semibold">
                                    <ShieldAlert size={18} /> Danger Zone
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    This action is permanent. All your data will be deleted.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-scaleIn">
                        <h3 className="text-lg font-bold text-red-600 mb-3">Final Confirmation</h3>
                        <p className="text-sm text-gray-600 mb-5">
                            This will permanently delete your account and all associated data.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2 rounded-full border text-sm font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                                disabled={loading}
                            >
                                {loading ? 'Deleting...' : 'Delete Forever'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style>{`
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out;
                }
                .animate-scaleIn {
                    animation: scaleIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}