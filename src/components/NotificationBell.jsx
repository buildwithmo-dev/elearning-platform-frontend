import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const { userProfile } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userProfile?.id) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      if (data) {
        setNotifications(data);
        setUnreadCount(data.length);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel(`user-${userProfile.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userProfile.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [userProfile?.id]);

  const markAllAsRead = async () => {
    if (!userProfile?.id) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userProfile.id);

    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">

      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-white/10 transition"
      >
        <Bell className="text-white" size={22} />

        {unreadCount > 0 && (
          <span className="
            absolute -top-1 -right-1
            bg-red-500 text-white text-[10px]
            px-1.5 py-0.5 rounded-full
            font-semibold
          ">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="
              absolute right-0 mt-3 w-80
              bg-white rounded-2xl shadow-2xl
              border border-gray-200 overflow-hidden
            "
          >

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h4 className="text-sm font-semibold text-gray-800">
                Notifications
              </h4>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">

              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Bell size={28} className="mb-2 opacity-40" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="
                      px-4 py-3 border-b last:border-none
                      hover:bg-gray-50 transition cursor-pointer
                    "
                  >
                    <p className="text-sm font-semibold text-gray-800">
                      {n.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {n.message}
                    </p>

                    <span className="text-[10px] text-blue-500 mt-1 block">
                      {new Date(n.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}