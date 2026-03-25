import { useState } from "react";
import React from "react";
import { Lock, ShieldCheck, Users, ChevronRight } from "lucide-react";

// ✅ FIXED import paths — go up 2 levels from pages/security/
import PasswordStrength   from "../../components/Security/PasswordStrength";
import TwoFactorAuth      from "../../components/Security/TwoFactorAuth";
import RoleBasedDashboard from "../../components/Security/RoleBasedDashboard";

type Tab = "password" | "2fa" | "roles";

const TABS: { id: Tab; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: "password", label: "Password",    icon: <Lock        size={18} />, desc: "Update & strengthen your password" },
  { id: "2fa",      label: "2FA Setup",   icon: <ShieldCheck size={18} />, desc: "Enable two-factor authentication"   },
  { id: "roles",    label: "Role Access", icon: <Users       size={18} />, desc: "View investor & entrepreneur UI"    },
];

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("password");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <h1 className="text-gray-900 text-2xl font-bold">Security & Access Control</h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">
          Manage authentication, passwords, and role-based access
        </p>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex gap-6">

          {/* ── Sidebar Tabs ── */}
          <div className="w-64 flex-shrink-0 space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left"
                style={{
                  background:  activeTab === tab.id ? "#eef2ff" : "white",
                  borderColor: activeTab === tab.id ? "#a5b4fc" : "#e5e7eb",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: activeTab === tab.id ? "#4f46e5" : "#f3f4f6",
                      color:      activeTab === tab.id ? "white"   : "#6b7280",
                    }}
                  >
                    {tab.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{tab.label}</p>
                    <p className="text-xs text-gray-400 leading-tight">{tab.desc}</p>
                  </div>
                </div>
                <ChevronRight
                  size={14}
                  className={`transition-transform flex-shrink-0 ${
                    activeTab === tab.id ? "rotate-90 text-indigo-500" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* ── Content Panel ── */}
          <div className="flex-1 min-w-0">
            {activeTab === "password" && <PasswordStrength />}
            {activeTab === "2fa"      && <TwoFactorAuth />}
            {activeTab === "roles"    && <RoleBasedDashboard />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default SecurityPage;