import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';
import { User, Mail, ShieldCheck, CheckCircle, Loader2, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfileTab() {
  const { userProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
    }
  }, [userProfile]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date(),
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully' });

      setTimeout(() => setMessage(null), 2500);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Public Profile</h2>
        <p className="text-sm text-gray-500">
          This information is visible to others
        </p>
      </div>

      {/* Alert */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mb-5 flex items-center gap-2 px-4 py-3 rounded-xl text-sm
            ${message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'}
          `}
        >
          <CheckCircle size={16} />
          {message.text}
        </motion.div>
      )}

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 grid md:grid-cols-3 gap-6">

        {/* Avatar Section */}
        <div className="flex flex-col items-center text-center border-b md:border-b-0 md:border-r pb-6 md:pb-0 md:pr-6">
          <div className="relative group">
            <div className="
              w-28 h-28 rounded-full
              bg-blue-100 text-blue-600
              flex items-center justify-center
              text-4xl font-bold
            ">
              {fullName?.charAt(0)?.toUpperCase() || <User />}
            </div>

            <button className="
              absolute bottom-0 right-0
              bg-white border shadow
              rounded-full p-2
              opacity-0 group-hover:opacity-100
              transition
            ">
              <Camera size={14} />
            </button>
          </div>

          <h3 className="mt-3 font-semibold text-gray-800">
            {fullName || 'Your Name'}
          </h3>

          <span className="mt-2 text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600">
            {userProfile?.is_instructor ? 'Instructor' : 'Student'}
          </span>
        </div>

        {/* Form */}
        <form
          onSubmit={handleUpdateProfile}
          className="md:col-span-2 space-y-5"
        >

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Full Name
            </label>

            <div className="
              mt-1 flex items-center gap-2
              border rounded-xl px-3 py-2
              focus-within:ring-2 focus-within:ring-blue-500
            ">
              <User size={16} className="text-gray-400" />
              <input
                type="text"
                className="w-full outline-none text-sm"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">
              Email Address
            </label>

            <div className="
              mt-1 flex items-center gap-2
              border rounded-xl px-3 py-2 bg-gray-50
            ">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                className="w-full bg-transparent text-sm outline-none text-gray-500"
                value={userProfile?.email || ''}
                disabled
              />
              <ShieldCheck size={16} className="text-green-500" />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              inline-flex items-center gap-2
              bg-blue-600 text-white
              px-6 py-2.5 rounded-full
              text-sm font-semibold
              hover:bg-blue-700 transition
              disabled:opacity-50
            "
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}