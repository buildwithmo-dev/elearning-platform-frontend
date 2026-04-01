import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { supabase } from '../services/supabase/supabaseClient';
import { User, ShieldCheck, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile(prev => ({ ...prev, full_name: fullName }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-bold text-gray-900">
          Account Settings
        </h2>
        <p className="text-gray-500 text-sm">
          Manage your profile information
        </p>
      </div>

      <div className="px-6 pb-6">

        {/* Profile Preview */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-6">

          <div className="
            w-14 h-14 rounded-full
            bg-blue-600 text-white
            flex items-center justify-center
            font-bold text-lg shadow-md
          ">
            {fullName ? fullName.charAt(0).toUpperCase() : <User size={20} />}
          </div>

          <div>
            <h4 className="font-semibold text-gray-800">
              {fullName || "User Name"}
            </h4>

            <span className="
              inline-block mt-1 text-xs px-3 py-1 rounded-full
              bg-blue-100 text-blue-600 font-medium
            ">
              {userProfile?.is_instructor ? "Certified Instructor" : "Student"}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="space-y-6">

          {/* Name Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Public Name
            </label>

            <div className="flex items-center border border-gray-300 rounded-xl px-3 focus-within:ring-2 focus-within:ring-blue-500">

              <User size={18} className="text-gray-400" />

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 bg-transparent focus:outline-none text-sm"
                required
              />
            </div>
          </div>

          {/* Instructor Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
              Instructor Authorization
            </label>

            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <ShieldCheck className="text-green-500" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Verified Instructor Account
                </p>
                <p className="text-xs text-gray-500">
                  Managed by administrator
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Changes
            </motion.button>

            {/* Success */}
            {success && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600 text-sm font-medium"
              >
                ✓ Updated successfully
              </motion.span>
            )}

            {/* Error */}
            {error && (
              <span className="text-red-500 text-sm">
                {error}
              </span>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}