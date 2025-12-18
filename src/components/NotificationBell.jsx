import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { supabase } from '../services/supabase/supabaseClient';
import { useAuth } from '../hooks/AuthContext';

export default function NotificationBell() {
    const { userProfile } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // --- CRITICAL FIX: Ensure userProfile and userProfile.id exist ---
        if (!userProfile?.id) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const { data, error } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', userProfile.id)
                    .eq('is_read', false)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;

                if (data) {
                    setNotifications(data);
                    setUnreadCount(data.length);
                }
            } catch (err) {
                console.error("Failed to fetch notifications:", err.message);
            }
        };

        fetchNotifications();

        const channel = supabase
            .channel(`user-notifications-${userProfile.id}`) // Use unique channel name
            .on('postgres_changes', { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'notifications',
                filter: `user_id=eq.${userProfile.id}` 
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
                setUnreadCount(prev => prev + 1);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userProfile?.id]); // Watch specifically for the ID change

    const markAllAsRead = async () => {
        if (!userProfile?.id) return;

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', userProfile.id);
        
        if (!error) {
            setUnreadCount(0);
            setNotifications([]);
        }
    };

    return (
        <div className="dropdown">
            <button 
                className="btn border-0 p-1 position-relative shadow-none" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <Bell size={22} className="text-white opacity-75 hover-opacity-100 transition-all" />
                {unreadCount > 0 && (
                    <span 
                        className="position-absolute translate-middle badge rounded-pill bg-danger border border-dark" 
                        style={{ 
                            fontSize: '9px', 
                            top: '5px', 
                            left: '85%',
                            padding: '0.35em 0.5em'
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <ul 
                className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-0 overflow-hidden animate-fade-in" 
                style={{ width: '320px', borderRadius: '16px', marginTop: '15px' }}
            >
                <li className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                    <span className="fw-bold text-dark">Notifications</span>
                    {unreadCount > 0 && (
                        <button 
                            className="btn btn-link btn-sm text-primary text-decoration-none p-0 fw-semibold" 
                            onClick={markAllAsRead}
                            style={{ fontSize: '12px' }}
                        >
                            Mark all read
                        </button>
                    )}
                </li>

                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <li className="p-5 text-center text-muted">
                            <Bell size={32} className="opacity-25 mb-2" />
                            <p className="small mb-0">No new notifications</p>
                        </li>
                    ) : (
                        notifications.map(n => (
                            <li key={n.id} className="p-3 border-bottom dropdown-item" style={{ whiteSpace: 'normal' }}>
                                <div className="fw-bold small text-dark mb-1">{n.title}</div>
                                <div className="text-muted" style={{ fontSize: '13px', lineHeight: '1.4' }}>{n.message}</div>
                                <div className="text-primary mt-1" style={{ fontSize: '10px' }}>
                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </li>
                        ))
                    )}
                </div>
            </ul>

            <style>{`
                .hover-opacity-100:hover { opacity: 1 !important; }
                .animate-fade-in {
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                /* Hide default dropdown arrow */
                .dropdown-toggle::after { display: none; }
            `}</style>
        </div>
    );
}