import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck, Smartphone, RefreshCw,
  CheckCircle, XCircle, Lock,
} from "lucide-react";

type Step = "intro" | "verify" | "success";

const MOCK_OTP = "123456";

const TwoFactorAuth = () => {
  const [step,       setStep]       = useState<Step>("intro");
  const [otp,        setOtp]        = useState<string[]>(Array(6).fill(""));
  const [error,      setError]      = useState("");
  const [timer,      setTimer]      = useState(30);
  const [canResend,  setCanResend]  = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Countdown ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (step !== "verify") return;
    setTimer(30);
    setCanResend(false);
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(iv); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [step]);

  // ── Handlers ───────────────────────────────────────────────────────────
  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = Array(6).fill("");
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    inputs.current[Math.min(digits.length, 5)]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits."); return; }
    if (code !== MOCK_OTP) {
      setError("Incorrect OTP. Hint: use 1 2 3 4 5 6");
      setOtp(Array(6).fill(""));
      inputs.current[0]?.focus();
      return;
    }
    setStep("success");
  };

  const handleResend = () => {
    setOtp(Array(6).fill(""));
    setError("");
    setStep("verify");
    setTimeout(() => inputs.current[0]?.focus(), 100);
  };

  const handleReset = () => {
    setStep("intro");
    setOtp(Array(6).fill(""));
    setError("");
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Lock size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-lg">Two-Factor Authentication</h2>
              <p className="text-gray-400 text-xs">Secure your account with OTP verification</p>
            </div>
          </div>
        </div>

        <div className="p-6">

          {/* ══ INTRO ══ */}
          {step === "intro" && (
            <div className="space-y-5">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-sm">
                  <Smartphone size={30} className="text-indigo-600" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-1">Enable 2FA</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  A 6-digit code will be sent to your registered phone each time you log in.
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-2">
                {[
                  { n: "1", text: "Click Enable 2FA below" },
                  { n: "2", text: "Enter the 6-digit OTP" },
                  { n: "3", text: "2FA is now active on your account" },
                ].map(item => (
                  <div key={item.n} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {item.n}
                    </div>
                    <span className="text-gray-600 text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Demo hint */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                💡 <strong>Demo mode:</strong> OTP is <strong>1 2 3 4 5 6</strong>
              </div>

              <button
                onClick={() => setStep("verify")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm"
              >
                Enable 2FA →
              </button>
            </div>
          )}

          {/* ══ VERIFY ══ */}
          {step === "verify" && (
            <div className="space-y-5">

              {/* Progress bar */}
              <div className="flex gap-1">
                {[1,2].map(s => (
                  <div key={s} className="flex-1 h-1 rounded-full"
                    style={{ background: s === 1 ? "#4f46e5" : "#e5e7eb" }} />
                ))}
              </div>

              <div className="text-center">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                  <Smartphone size={26} className="text-indigo-500" />
                </div>
                <h3 className="text-gray-900 font-semibold text-base">Enter OTP</h3>
                <p className="text-gray-400 text-xs mt-1">
                  Sent to <strong>+92 ••••••1234</strong>
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { inputs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(i, e.target.value)}
                    onKeyDown={e => handleKeyDown(i, e)}
                    className="w-11 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all"
                    style={{
                      borderColor: error  ? "#f87171"
                                 : digit  ? "#4f46e5"
                                          : "#e5e7eb",
                      background:  error  ? "#fef2f2"
                                 : digit  ? "#eef2ff"
                                          : "white",
                      color:       error  ? "#dc2626"
                                 : digit  ? "#4338ca"
                                          : "#111827",
                    }}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <XCircle size={14} className="text-red-500 flex-shrink-0" />
                  <span className="text-red-600 text-xs">{error}</span>
                </div>
              )}

              {/* Timer / Resend */}
              <p className="text-center text-xs text-gray-400">
                {canResend ? (
                  <button onClick={handleResend}
                    className="inline-flex items-center gap-1 text-indigo-600 font-medium hover:underline">
                    <RefreshCw size={12} /> Resend OTP
                  </button>
                ) : (
                  <>Resend in <strong className="text-gray-600">{timer}s</strong></>
                )}
              </p>

              <button
                onClick={handleVerify}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm"
              >
                Verify OTP
              </button>

              <button onClick={handleReset}
                className="w-full py-2 text-gray-400 text-sm hover:text-gray-600 transition">
                ← Back
              </button>
            </div>
          )}

          {/* ══ SUCCESS ══ */}
          {step === "success" && (
            <div className="text-center space-y-5 py-4">

              {/* Progress bar - full */}
              <div className="flex gap-1">
                {[1,2].map(s => (
                  <div key={s} className="flex-1 h-1 rounded-full bg-indigo-600" />
                ))}
              </div>

              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle size={40} className="text-green-500" />
              </div>

              <div>
                <h3 className="text-gray-900 font-bold text-xl mb-1">2FA Enabled!</h3>
                <p className="text-gray-400 text-sm">
                  Your account is now protected with two-factor authentication.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-xs text-green-800 font-medium">
                ✅ Two-factor authentication is <strong>active</strong>
              </div>

              <button onClick={handleReset}
                className="w-full py-2.5 border border-gray-200 text-gray-500 font-medium rounded-xl hover:bg-gray-50 text-sm transition">
                Reset Demo
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;