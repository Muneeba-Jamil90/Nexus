import { useState } from "react";
import {
  TrendingUp, DollarSign, Eye, Calendar,
  Rocket, Mic, Users, BarChart3,
  ShieldCheck,
} from "lucide-react";

type Role = "investor" | "entrepreneur";

// ─── Investor Cards ────────────────────────────────────────────────────────
const InvestorView = () => (
  <div className="space-y-4">
    <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2">
      <ShieldCheck size={15} className="text-blue-600" />
      <span className="text-blue-700 text-xs font-medium">
        You are viewing the <strong>Investor</strong> dashboard
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Active Investments", value: "7",       icon: <TrendingUp size={20} />, color: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
        { label: "Total Deployed",     value: "$45,000", icon: <DollarSign size={20} />, color: "#166534", bg: "#dcfce7", border: "#86efac" },
        { label: "Deals Reviewed",     value: "23",      icon: <Eye        size={20} />, color: "#6b21a8", bg: "#f3e8ff", border: "#d8b4fe" },
        { label: "Avg ROI",            value: "12.4%",   icon: <BarChart3  size={20} />, color: "#854d0e", bg: "#fef3c7", border: "#fcd34d" },
      ].map(card => (
        <div key={card.label}
          className="bg-white rounded-xl p-4 border shadow-sm flex items-start gap-3"
          style={{ borderColor: card.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: card.bg }}>
            <span style={{ color: card.color }}>{card.icon}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">{card.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: card.color }}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Recent activity */}
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Recent Deal Activity</p>
      <div className="space-y-2.5">
        {[
          { deal: "TechStartup Inc.",  amount: "$5,000",  status: "Funded",  color: "#166534", bg: "#dcfce7" },
          { deal: "GreenEnergy Co.",   amount: "$12,000", status: "Pending", color: "#854d0e", bg: "#fef3c7" },
          { deal: "EduPlatform Ltd.",  amount: "$3,000",  status: "Funded",  color: "#166534", bg: "#dcfce7" },
        ].map(item => (
          <div key={item.deal} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.deal}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">{item.amount}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: item.bg, color: item.color }}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Entrepreneur Cards ────────────────────────────────────────────────────
const EntrepreneurView = () => (
  <div className="space-y-4">
    <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
      <ShieldCheck size={15} className="text-green-600" />
      <span className="text-green-700 text-xs font-medium">
        You are viewing the <strong>Entrepreneur</strong> dashboard
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: "Funding Raised",   value: "$18,500", icon: <Rocket   size={20} />, color: "#166534", bg: "#dcfce7", border: "#86efac" },
        { label: "Active Pitches",   value: "3",       icon: <Mic      size={20} />, color: "#6b21a8", bg: "#f3e8ff", border: "#d8b4fe" },
        { label: "Investor Views",   value: "142",     icon: <Users    size={20} />, color: "#1e40af", bg: "#dbeafe", border: "#93c5fd" },
        { label: "Meetings Booked",  value: "5",       icon: <Calendar size={20} />, color: "#854d0e", bg: "#fef3c7", border: "#fcd34d" },
      ].map(card => (
        <div key={card.label}
          className="bg-white rounded-xl p-4 border shadow-sm flex items-start gap-3"
          style={{ borderColor: card.border }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: card.bg }}>
            <span style={{ color: card.color }}>{card.icon}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">{card.label}</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: card.color }}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Pitch status */}
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Active Pitches</p>
      <div className="space-y-3">
        {[
          { name: "Series A Round",  progress: 72, raised: "$36,000", target: "$50,000" },
          { name: "Seed Funding",    progress: 45, raised: "$9,000",  target: "$20,000" },
          { name: "Angel Round",     progress: 90, raised: "$27,000", target: "$30,000" },
        ].map(pitch => (
          <div key={pitch.name}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">{pitch.name}</span>
              <span className="text-xs text-gray-400">{pitch.raised} / {pitch.target}</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500 transition-all"
                style={{ width: `${pitch.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const RoleBasedDashboard = () => {
  const [role, setRole] = useState<Role>("investor");

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <ShieldCheck size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Role-Based Access</h1>
          <p className="text-gray-400 text-sm">Different views for Investors and Entrepreneurs</p>
        </div>
      </div>

      {/* Role Toggle */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-gray-700">Switch Role View</p>
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["investor", "entrepreneur"] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="px-5 py-2 text-sm font-semibold rounded-lg transition-all capitalize"
                style={{
                  background: role === r ? "white"   : "transparent",
                  color:      role === r ? "#111827" : "#9ca3af",
                  boxShadow:  role === r ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {role === "investor" ? <InvestorView /> : <EntrepreneurView />}
      </div>
    </div>
  );
};

export default RoleBasedDashboard;