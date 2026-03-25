import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Eye, EyeOff, Lock } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Rule {
  label: string;
  met: boolean;
}

interface StrengthLevel {
  label: string;
  color: string;
  bg: string;
  border: string;
  bars: number;
  icon: React.ReactNode;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const getStrength = (pw: string): StrengthLevel => {
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;

  if (score <= 1) return {
    label: "Weak",   bars: 1,
    color: "#991b1b", bg: "#fee2e2", border: "#fca5a5",
    icon: <ShieldX size={14} />
  };
  if (score === 2) return {
    label: "Fair",   bars: 2,
    color: "#92400e", bg: "#fef3c7", border: "#fcd34d",
    icon: <ShieldAlert size={14} />
  };
  if (score === 3) return {
    label: "Good",   bars: 3,
    color: "#1e40af", bg: "#dbeafe", border: "#93c5fd",
    icon: <ShieldAlert size={14} />
  };
  return {
    label: "Strong", bars: 4,
    color: "#166534", bg: "#dcfce7", border: "#86efac",
    icon: <ShieldCheck size={14} />
  };
};

const BAR_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

// ─── Component ─────────────────────────────────────────────────────────────
const PasswordStrength = () => {
  const [password,    setPassword]    = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved,       setSaved]       = useState(false);

  const strength = getStrength(password);
  const match    = confirmPw.length > 0 && password === confirmPw;
  const mismatch = confirmPw.length > 0 && password !== confirmPw;

  const rules: Rule[] = [
    { label: "At least 8 characters",  met: password.length >= 8           },
    { label: "One uppercase letter",   met: /[A-Z]/.test(password)         },
    { label: "One number",             met: /[0-9]/.test(password)         },
    { label: "One special character",  met: /[^A-Za-z0-9]/.test(password)  },
  ];

  const canSave = strength.bars >= 3 && match;

  const handleSave = () => {
    if (!canSave) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setPassword("");
    setConfirmPw("");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Lock size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-gray-900 font-bold text-lg">Password Security</h2>
            <p className="text-gray-400 text-xs">Set a strong password to protect your account</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">

        {/* ── Success Banner ── */}
        {saved && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-medium">
            <ShieldCheck size={16} />
            Password updated successfully!
          </div>
        )}

        {/* ── New Password ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setSaved(false); }}
              placeholder="Enter new password"
              className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button
              onClick={() => setShowPw(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* ── Strength Bars ── */}
        {password.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Password strength</span>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{
                  background: strength.bg,
                  color:      strength.color,
                  border:     `1px solid ${strength.border}`,
                }}
              >
                {strength.icon} {strength.label}
              </span>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background: i <= strength.bars
                      ? BAR_COLORS[strength.bars - 1]
                      : "#e5e7eb",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Rules Checklist ── */}
        {password.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2.5">
            {rules.map(rule => (
              <div key={rule.label} className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold transition-all ${
                    rule.met
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {rule.met ? "✓" : "·"}
                </div>
                <span
                  className={`text-xs transition-colors ${
                    rule.met ? "text-green-700 font-medium" : "text-gray-400"
                  }`}
                >
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── Confirm Password ── */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              placeholder="Re-enter your password"
              className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all ${
                match    ? "border-green-400 focus:ring-green-200"  :
                mismatch ? "border-red-400   focus:ring-red-200"    :
                           "border-gray-200  focus:ring-indigo-300"
              }`}
            />
            <button
              onClick={() => setShowConfirm(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {match && (
            <p className="text-green-600 text-xs mt-1.5 font-medium flex items-center gap-1">
              <ShieldCheck size={12} /> Passwords match
            </p>
          )}
          {mismatch && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <ShieldX size={12} /> Passwords do not match
            </p>
          )}
        </div>

        {/* ── Save Button ── */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full py-3 font-semibold rounded-xl text-sm transition-all"
          style={{
            background: canSave ? "#4f46e5" : "#e5e7eb",
            color:      canSave ? "white"   : "#9ca3af",
            cursor:     canSave ? "pointer"  : "not-allowed",
          }}
        >
          {!password         ? "Enter a password"      :
           strength.bars < 3 ? "Password too weak"     :
           !match            ? "Passwords don't match" :
                               "Update Password"}
        </button>

      </div>
    </div>
  );
};

export default PasswordStrength;