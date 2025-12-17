import React, { useState } from 'react';
import SecurityTab from '../components/SecurityTab';
import NotificationsTab from '../components/NotificationsTab';
import ProfileTab from '../components/ProfileTab'; 
import { Shield, Bell, User } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';

const SettingsPage = () => {
  const { userProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile'); 

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': 
        return <ProfileTab />; 
      case 'security': 
        return <SecurityTab />;
      case 'notifications': 
        return <NotificationsTab userId={userProfile?.id} />;
      default: 
        return <ProfileTab />;
    }
  };

  return (
    <div className="container py-5" style={{ marginTop: '70px' }}>
      <div className="row g-4">
        {/* Settings Sidebar */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 p-3">
            <h5 className="fw-bold mb-4 px-3">Settings</h5>
            <div className="nav flex-column nav-pills gap-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`nav-link border-0 text-start d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${activeTab === 'profile' ? 'active shadow-sm text-white' : 'text-muted hover-bg-light'}`}
              >
                <User size={18} /> Profile Info
              </button>

              <button 
                onClick={() => setActiveTab('security')}
                className={`nav-link border-0 text-start d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${activeTab === 'security' ? 'active shadow-sm text-white' : 'text-muted hover-bg-light'}`}
              >
                <Shield size={18} /> Security
              </button>
              
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`nav-link border-0 text-start d-flex align-items-center gap-3 p-3 rounded-3 transition-all ${activeTab === 'notifications' ? 'active shadow-sm text-white' : 'text-muted hover-bg-light'}`}
              >
                <Bell size={18} /> Notifications
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm rounded-4 p-4 min-vh-50">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <style>{`
        .nav-link.active { background-color: #0d6efd !important; color: white !important; }
        .hover-bg-light:hover { background-color: #f8f9fa; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default SettingsPage;