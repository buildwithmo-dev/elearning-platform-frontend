import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/supabaseClient';
import { Bell, Mail, Megaphone, Loader2, Info } from 'lucide-react';

export default function NotificationsTab({ userId }) {
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [settings, setSettings] = useState({
        email_notifications: true,
        course_updates: true,
        marketing_emails: false
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
        setSettings(prev => ({ ...prev, [key]: newValue })); // Optimistic update
        setSyncing(true);

        const { error } = await supabase
            .from('notification_settings')
            .upsert({ user_id: userId, [key]: newValue });

        if (error) console.error("Sync Error:", error.message);
        setTimeout(() => setSyncing(false), 600);
    };

    if (loading) return <div className="text-center py-5"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="fw-bold mb-1">Notifications</h5>
                    <p className="text-muted small mb-0">Manage how we reach you.</p>
                </div>
                {syncing && <span className="badge bg-primary bg-opacity-10 text-primary border-0 rounded-pill px-3 py-2 small">Syncing...</span>}
            </div>

            <div className="card border-0 bg-light rounded-4 overflow-hidden">
                <NotificationItem 
                    icon={<Mail size={18}/>} 
                    color="primary"
                    title="Email Alerts" 
                    desc="Security notices and account login alerts."
                    checked={settings.email_notifications}
                    onToggle={() => toggle('email_notifications')}
                />
                <NotificationItem 
                    icon={<Bell size={18}/>} 
                    color="success"
                    title="Course Progress" 
                    desc="New lessons, assignments, and instructor replies."
                    checked={settings.course_updates}
                    onToggle={() => toggle('course_updates')}
                />
                <NotificationItem 
                    icon={<Megaphone size={18}/>} 
                    color="warning"
                    title="Special Offers" 
                    desc="Discounts on new courses and newsletters."
                    checked={settings.marketing_emails}
                    onToggle={() => toggle('marketing_emails')}
                    isLast={true}
                />
            </div>

            <div className="mt-4 p-3 bg-white border rounded-4 d-flex gap-3 align-items-center">
                <Info size={20} className="text-muted" />
                <p className="small text-muted mb-0">Push notifications for mobile are currently managed in your browser settings.</p>
            </div>
        </div>
    );
}

// Reusable Switch Component
const NotificationItem = ({ icon, title, desc, checked, onToggle, color, isLast }) => (
    <div className={`p-4 d-flex justify-content-between align-items-center ${!isLast ? 'border-bottom' : ''}`}>
        <div className="d-flex gap-3 align-items-center">
            <div className={`bg-${color} bg-opacity-10 p-2 rounded-3 text-${color}`}>
                {icon}
            </div>
            <div>
                <h6 className="fw-bold mb-0 small">{title}</h6>
                <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{desc}</p>
            </div>
        </div>
        <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" checked={checked} onChange={onToggle} style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }} />
        </div>
    </div>
);