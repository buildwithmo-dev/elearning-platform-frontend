import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { Bell, Mail, Megaphone, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsTab({ userId }) {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [settings, setSettings] = useState({
    email_notifications: true,
    course_updates: true,
    marketing_emails: false,
  });

  useEffect(() => {
    async function loadSettings() {
      if (!userId) return;

      const { data } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) setSettings(data);
      setLoading(false);
    }

    loadSettings();
  }, [userId]);

  const toggle = async (key) => {
    const newValue = !settings[key];

    setSettings((prev) => ({ ...prev, [key]: newValue }));
    setSyncing(true);

    await supabase
      .from('notification_settings')
      .upsert({ user_id: userId, [key]: newValue });

    setTimeout(() => setSyncing(false), 500);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          <p className="text-sm text-gray-500">Manage how we reach you</p>
        </div>

        {syncing && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
          >
            Syncing...
          </motion.span>
        )}
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">

        <NotificationItem
          icon={<Mail size={18} />}
          color="blue"
          title="Email Alerts"
          desc="Security notices and login alerts"
          checked={settings.email_notifications}
          onToggle={() => toggle('email_notifications')}
        />

        <NotificationItem
          icon={<Bell size={18} />}
          color="green"
          title="Course Progress"
          desc="Lessons, assignments, replies"
          checked={settings.course_updates}
          onToggle={() => toggle('course_updates')}
        />

        <NotificationItem
          icon={<Megaphone size={18} />}
          color="amber"
          title="Special Offers"
          desc="Discounts and newsletters"
          checked={settings.marketing_emails}
          onToggle={() => toggle('marketing_emails')}
          isLast
        />

      </div>

      {/* Info */}
      <div className="mt-6 flex gap-3 items-start p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <Info size={18} className="text-gray-400 mt-0.5" />
        <p className="text-sm text-gray-500">
          Push notifications are managed by your browser settings.
        </p>
      </div>
    </div>
  );
}

/* ---------- Item ---------- */

const NotificationItem = ({
  icon,
  title,
  desc,
  checked,
  onToggle,
  color,
  isLast
}) => {
  return (
    <div className={`flex items-center justify-between px-5 py-4 ${!isLast && 'border-b'}`}>

      {/* Left */}
      <div className="flex items-center gap-4">
        <div className={`
          p-2 rounded-xl
          bg-${color}-100 text-${color}-600
        `}>
          {icon}
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800">
            {title}
          </h4>
          <p className="text-xs text-gray-500">
            {desc}
          </p>
        </div>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`
          relative w-11 h-6 rounded-full transition
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition
            ${checked ? 'translate-x-5' : ''}
          `}
        />
      </button>

    </div>
  );
};