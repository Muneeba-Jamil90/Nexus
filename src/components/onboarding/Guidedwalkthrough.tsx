import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { Map } from "lucide-react";

const STEPS: Step[] = [
  {
    target: "body",
    content: (
      <div className="text-center py-2">
        <div className="text-4xl mb-3">👋</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          Welcome to Business Nexus!
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          Let's take a quick tour of everything available in your dashboard.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "[data-tour='sidebar']",
    content: (
      <div>
        <h3 className="font-bold text-gray-900 mb-1">📌 Navigation</h3>
        <p className="text-gray-500 text-sm">
          Use the sidebar to navigate between all modules — Dashboard, Payments, Security, Messages, and more.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-tour='payments']",
    content: (
      <div>
        <h3 className="font-bold text-gray-900 mb-1">💳 Payments</h3>
        <p className="text-gray-500 text-sm">
          Deposit, withdraw, transfer funds, or invest directly into startup deals from the Payment Center.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-tour='security']",
    content: (
      <div>
        <h3 className="font-bold text-gray-900 mb-1">🔐 Security</h3>
        <p className="text-gray-500 text-sm">
          Update your password, enable Two-Factor Authentication, and switch between Investor and Entrepreneur views.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-tour='messages']",
    content: (
      <div>
        <h3 className="font-bold text-gray-900 mb-1">💬 Messages</h3>
        <p className="text-gray-500 text-sm">
          Chat in real time with investors or entrepreneurs. Start conversations and build connections.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-tour='deals']",
    content: (
      <div>
        <h3 className="font-bold text-gray-900 mb-1">🤝 Deals</h3>
        <p className="text-gray-500 text-sm">
          Browse active investment deals, review pitch details, and fund opportunities directly.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "[data-tour='settings']",
    content: (
      <div>
        <h3 className="font-bold text-gray-900 mb-1">⚙️ Settings</h3>
        <p className="text-gray-500 text-sm">
          Customize your profile, notification preferences, and account settings here.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "body",
    content: (
      <div className="text-center py-2">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">You're all set!</h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          You now know your way around Business Nexus. Start connecting with investors and entrepreneurs!
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
];

interface Props {
  autoStart?: boolean;
}

const GuidedWalkthrough = ({ autoStart = false }: Props) => {
  const [run, setRun] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!autoStart) return;
    const seen = localStorage.getItem("nexus_tour_seen");
    if (!seen) {
      setTimeout(() => setRun(true), 1000);
      localStorage.setItem("nexus_tour_seen", "true");
    }
  }, [autoStart]);

  const handleCallback = (data: CallBackProps) => {
    const { status, index } = data;
    setStepIdx(index);
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStepIdx(0);
    }
  };

  return (
    <>
      <Joyride
        steps={STEPS}
        run={run}
        stepIndex={stepIdx}
        continuous
        showSkipButton
        showProgress
        scrollToFirstStep
        callback={handleCallback}
        styles={{
          options: {
            primaryColor: "#4f46e5",
            backgroundColor: "#ffffff",
            textColor: "#374151",
            overlayColor: "rgba(0,0,0,0.5)",
            spotlightShadow: "0 0 0 2px #4f46e5",
            arrowColor: "#ffffff",
            zIndex: 10000,
          },
          tooltip: {
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            maxWidth: "320px",
          },
          tooltipTitle: {
            fontSize: "15px",
            fontWeight: "700",
            color: "#111827",
          },
          tooltipContent: {
            fontSize: "13px",
            padding: "8px 0 0 0",
          },
          buttonNext: {
            backgroundColor: "#4f46e5",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: "600",
            padding: "8px 18px",
          },
          buttonBack: {
            color: "#6b7280",
            fontSize: "13px",
            marginRight: "8px",
          },
          buttonSkip: {
            color: "#9ca3af",
            fontSize: "12px",
          },
        }}
        locale={{
          back: "← Back",
          close: "Close",
          last: "Finish 🎉",
          next: "Next →",
          skip: "Skip tour",
        }}
      />

      {!run && (
        <button
          onClick={() => {
            setRun(true);
            setStepIdx(0);
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: "#4f46e5", color: "white" }}
          title="Take a tour"
        >
          <Map size={16} />
          Take a Tour
        </button>
      )}
    </>
  );
};

export default GuidedWalkthrough;