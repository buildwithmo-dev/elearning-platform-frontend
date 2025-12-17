import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';

export default function NotificationBell() {
    const { userProfile } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userProfile) return;

        // 1. Initial Fetch of unread notifications
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

        // 2. Setup Realtime Listener
        const channel = supabase
            .channel('realtime_notifications')
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `user_id=eq.${userProfile.id}` 
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setUnreadCount(prev => prev + 1);
                // Optional: Trigger a browser sound or toast here
            })
            .subscribe();

        return () => supabase.removeChannel(channel);
    }, [userProfile]);

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userProfile.id);
        
        setUnreadCount(0);
        setNotifications([]);
    };

    return (
        <div className="dropdown">
            <button className="btn btn-light rounded-circle position-relative p-2" data-bs-toggle="dropdown">
                <Bell size={20} className="text-muted" />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '10px' }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow border-0 py-0 overflow-hidden" style={{ width: '300px', borderRadius: '15px' }}>
                <li className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <span className="fw-bold">Notifications</span>
                    {unreadCount > 0 && (
                        <button className="btn btn-sm text-primary p-0 small" onClick={markAllAsRead}>Mark all read</button>
                    )}
                </li>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <li className="p-4 text-center text-muted small">No new notifications</li>
                    ) : (
                        notifications.map(n => (
                            <li key={n.id} className="p-3 border-bottom dropdown-item" style={{ whiteSpace: 'normal' }}>
                                <div className="fw-bold small">{n.title}</div>
                                <div className="text-muted" style={{ fontSize: '12px' }}>{n.message}</div>
                            </li>
                        ))
                    )}
                </div>
            </ul>
        </div>
    );
}