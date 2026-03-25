import { useState } from "react";
import {
  ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Handshake,
  Wallet, TrendingUp, CheckCircle, Clock, XCircle,
} from "lucide-react";
import { Transaction, TxType, TxStatus } from "../../types/payment";
import { MOCK_TRANSACTIONS, MOCK_DEALS } from "../../data/mockpayment";

// ─── Config ────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<TxStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Completed: { color: "#166534", bg: "#dcfce7", border: "#86efac", icon: <CheckCircle size={12} /> },
  Pending:   { color: "#854d0e", bg: "#fef3c7", border: "#fcd34d", icon: <Clock       size={12} /> },
  Failed:    { color: "#991b1b", bg: "#fee2e2", border: "#fca5a5", icon: <XCircle     size={12} /> },
};

const TYPE_CFG: Record<TxType, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  Deposit:  { color: "#166534", bg: "#dcfce7", icon: <ArrowDownLeft  size={16} />, label: "Deposit"   },
  Withdraw: { color: "#991b1b", bg: "#fee2e2", icon: <ArrowUpRight   size={16} />, label: "Withdraw"  },
  Transfer: { color: "#1e40af", bg: "#dbeafe", icon: <ArrowLeftRight size={16} />, label: "Transfer"  },
  FundDeal: { color: "#6b21a8", bg: "#f3e8ff", icon: <Handshake      size={16} />, label: "Fund Deal" },
};

// ─── Modal ─────────────────────────────────────────────────────────────────
interface ModalProps {
  type: TxType;
  balance: number;
  onClose: () => void;
  onSubmit: (tx: Transaction) => void;
}

const ActionModal = ({ type, balance, onClose, onSubmit }: ModalProps) => {
  const [amount,   setAmount]   = useState("");
  const [receiver, setReceiver] = useState("");
  const [dealIdx,  setDealIdx]  = useState(0);
  const [step,     setStep]     = useState<1 | 2 | 3>(1);
  const [error,    setError]    = useState("");

  const cfg = TYPE_CFG[type];

  const validate = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0)          { setError("Enter a valid amount."); return false; }
    if (type !== "Deposit" && num > balance) { setError("Insufficient balance."); return false; }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const num = parseFloat(amount);
    const deal = MOCK_DEALS[dealIdx];
    onSubmit({
      id:          Date.now(),
      type,
      amount:      num,
      sender:      type === "Deposit" ? "Bank Account" : "My Wallet",
      receiver:    type === "Deposit"  ? "My Wallet"
                 : type === "FundDeal" ? deal.title
                 : receiver || "Recipient",
      status:      "Pending",
      date:        new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      description: type === "FundDeal" ? `Investment in ${deal.title}` : `${type} transaction`,
    });
    setStep(3);
    setTimeout(onClose, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span style={{ color: cfg.color }}>{cfg.icon}</span>
            <span className="font-semibold text-gray-900">{cfg.label}</span>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 text-sm">
            ✕
          </button>
        </div>

        {/* Steps bar (FundDeal only) */}
        {type === "FundDeal" && (
          <div className="flex gap-1 px-5 pt-4">
            {[1,2,3].map(s => (
              <div key={s}
                className="flex-1 h-1 rounded-full transition-all"
                style={{ background: step >= s ? "#6d28d9" : "#e5e7eb" }} />
            ))}
          </div>
        )}

        <div className="p-5 space-y-4">
          {step === 3 ? (
            // Success
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle size={36} className="text-green-500" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {type === "FundDeal" ? "Investment Confirmed!" : `${type} Successful!`}
              </p>
              <p className="text-sm text-gray-400">
                ${parseFloat(amount).toLocaleString()} processed successfully
              </p>
            </div>
          ) : type === "FundDeal" && step === 1 ? (
            // Fund Deal — pick deal
            <>
              <p className="text-sm font-semibold text-gray-600">Select a Deal to Fund</p>
              {MOCK_DEALS.map((deal, i) => (
                <div key={deal.id} onClick={() => setDealIdx(i)}
                  className="p-3 rounded-xl border cursor-pointer transition"
                  style={{ borderColor: dealIdx === i ? "#7c3aed" : "#e5e7eb",
                           background:  dealIdx === i ? "#f5f3ff" : "white" }}>
                  <p className="font-semibold text-gray-800 text-sm">{deal.title}</p>
                  <p className="text-xs text-gray-400">Founder: {deal.founder}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-purple-500"
                      style={{ width: `${Math.round((deal.raised / deal.target) * 100)}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    ${deal.raised.toLocaleString()} / ${deal.target.toLocaleString()} raised
                  </p>
                </div>
              ))}
              <button onClick={() => setStep(2)}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm">
                Next →
              </button>
            </>
          ) : (
            // Amount form
            <>
              {type === "FundDeal" && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-sm text-purple-800">
                  Funding: <strong>{MOCK_DEALS[dealIdx].title}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input type="number" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }}
                    placeholder="0.00"
                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>

              {(type === "Withdraw" || type === "Transfer") && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                    {type === "Transfer" ? "Recipient Name / Email" : "Bank Account"}
                  </label>
                  <input type="text" value={receiver} onChange={e => setReceiver(e.target.value)}
                    placeholder={type === "Transfer" ? "e.g. john@email.com" : "Bank account details"}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              )}

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <div className="bg-gray-50 rounded-xl p-3 flex justify-between">
                <span className="text-gray-400 text-xs">Available Balance</span>
                <span className="font-bold text-gray-900 text-sm">${balance.toLocaleString()}.00</span>
              </div>

              <div className="flex gap-3">
                {type === "FundDeal" && (
                  <button onClick={() => setStep(1)}
                    className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">
                    ← Back
                  </button>
                )}
                <button onClick={handleSubmit}
                  className="flex-1 py-2.5 text-white font-semibold rounded-xl text-sm transition"
                  style={{ background: cfg.color }}>
                  Confirm {cfg.label}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────
const PaymentDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [balance,      setBalance]      = useState(12700);
  const [activeModal,  setActiveModal]  = useState<TxType | null>(null);
  const [filterStatus, setFilterStatus] = useState<TxStatus | "All">("All");
  const [toast,        setToast]        = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSubmit = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (tx.type === "Deposit")  setBalance(b => b + tx.amount);
    else                         setBalance(b => b - tx.amount);

    // Auto-complete after 2s
    setTimeout(() => {
      setTransactions(prev =>
        prev.map(t => t.id === tx.id ? { ...t, status: "Completed" } : t)
      );
    }, 2000);

    showToast(`${tx.type} of $${tx.amount.toLocaleString()} initiated!`);
    setActiveModal(null);
  };

  const filtered = filterStatus === "All"
    ? transactions
    : transactions.filter(t => t.status === filterStatus);

  const totalDeposited  = transactions.filter(t => t.type === "Deposit"  && t.status === "Completed").reduce((s,t) => s + t.amount, 0);
  const totalWithdrawn  = transactions.filter(t => t.type === "Withdraw" && t.status === "Completed").reduce((s,t) => s + t.amount, 0);
  const totalTransferred = transactions.filter(t => (t.type === "Transfer" || t.type === "FundDeal") && t.status === "Completed").reduce((s,t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl shadow flex items-center gap-2">
          <CheckCircle size={16} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Wallet size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-gray-900 text-2xl font-bold">Payment Center</h1>
          <p className="text-gray-400 text-sm">Manage your wallet, transactions, and deal funding</p>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Total Wallet Balance</p>
            <p className="text-4xl font-bold mt-1">
              ${balance.toLocaleString()}
              <span className="text-indigo-300 text-lg font-normal">.00</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Wallet size={28} />
          </div>
        </div>
        <div className="flex items-center gap-1 text-indigo-200 text-xs">
          <TrendingUp size={12} />
          <span>Simulated wallet — no real money involved</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Deposited",   value: `$${totalDeposited.toLocaleString()}`,   color: "#166534", bg: "#dcfce7", border: "#86efac", icon: <ArrowDownLeft  size={18} /> },
          { label: "Total Withdrawn",   value: `$${totalWithdrawn.toLocaleString()}`,   color: "#991b1b", bg: "#fee2e2", border: "#fca5a5", icon: <ArrowUpRight   size={18} /> },
          { label: "Total Transferred", value: `$${totalTransferred.toLocaleString()}`, color: "#1e40af", bg: "#dbeafe", border: "#93c5fd", icon: <ArrowLeftRight size={18} /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-gray-900 font-bold">{s.value}</p>
              <p className="text-gray-400 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(["Deposit","Withdraw","Transfer","FundDeal"] as TxType[]).map(type => {
          const cfg = TYPE_CFG[type];
          return (
            <button key={type} onClick={() => setActiveModal(type)}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: cfg.bg }}>
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
              </div>
              <span className="text-gray-700 text-sm font-semibold">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-gray-900 font-semibold">Transaction History</h2>
          <div className="flex gap-2">
            {(["All","Completed","Pending","Failed"] as const).map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className="px-3 py-1 text-xs rounded-full font-medium transition"
                style={{
                  background: filterStatus === f ? "#4f46e5" : "#f3f4f6",
                  color:      filterStatus === f ? "white"   : "#6b7280",
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Type","Amount","Sender","Receiver","Status","Date"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(tx => {
                const tc = TYPE_CFG[tx.type];
                const sc = STATUS_CFG[tx.status];
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: tc.bg }}>
                          <span style={{ color: tc.color }}>{tc.icon}</span>
                        </div>
                        <span className="text-gray-700 font-medium">{tc.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900">${tx.amount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{tx.sender}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{tx.receiver}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                        {sc.icon} {tx.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">{tx.date}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400 text-sm">
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {activeModal && (
        <ActionModal
          type={activeModal}
          balance={balance}
          onClose={() => setActiveModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default PaymentDashboard;