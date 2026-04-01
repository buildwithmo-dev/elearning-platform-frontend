import React, { useState } from "react";
import SecurityTab from "../components/SecurityTab";
import NotificationsTab from "../components/NotificationsTab";
import ProfileTab from "../components/ProfileTab";
import { Shield, Bell, User } from "lucide-react";
import { useAuth } from "../hooks/AuthContext";

const tabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "security", label: "Security", icon: Shield },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab userId={userProfile?.id} />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-24 px-6 lg:px-12">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 backdrop-blur-xl bg-white/70 border border-white/40 shadow-xl rounded-3xl p-5">

            <h2 className="text-lg font-semibold text-gray-800 mb-5 px-2">
              Settings
            </h2>

            <div className="space-y-2">
              {tabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${
                      activeTab === key
                        ? "bg-black text-white shadow-md"
                        : "text-gray-600 hover:bg-white hover:shadow-sm"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeTab}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your account settings and preferences
            </p>
          </div>

          {/* PANEL */}
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl p-6 shadow-sm min-h-[500px] transition-all">

            {/* subtle fade animation */}
            <div key={activeTab} className="animate-[fadeIn_.25s_ease]">
              {renderTabContent()}
            </div>

          </div>
        </div>
      </div>

      {/* animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}