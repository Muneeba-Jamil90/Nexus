// src/components/chat/Videocall.tsx

import { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneCall,
  PhoneOff,
  MonitorUp,
  X,
} from "lucide-react";

interface VideoCallProps {
  onClose?: () => void;
  remoteUserName?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({
  onClose,
  remoteUserName = "Investor",
}) => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);

  // Timer jab call start ho
  const handleToggleCall = () => {
    if (!isCallActive) {
      setIsCallActive(true);
      const timer = setInterval(() => {
        setCallDuration((prev) => {
          if (prev >= 3599) { clearInterval(timer); return prev; }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsCallActive(false);
      setCallDuration(0);
    }
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-950 rounded-xl overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {isCallActive && (
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          <span className="text-white text-sm font-medium">
            {isCallActive
              ? `Call with ${remoteUserName} — ${formatTime(callDuration)}`
              : `Video Call — ${remoteUserName}`}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Video Grid ── */}
      <div className="flex-1 grid grid-cols-2 gap-3 p-4">

        {/* Remote User Tile */}
        <div className="relative bg-gray-800 rounded-xl flex items-center justify-center border border-gray-700 overflow-hidden">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-semibold">
              {remoteUserName.charAt(0)}
            </div>
            <span className="text-gray-300 text-xs">{remoteUserName}</span>
          </div>
          {!isCallActive && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Waiting for call...</span>
            </div>
          )}
          <span className="absolute bottom-2 left-3 text-xs text-gray-400 bg-black/50 px-2 py-0.5 rounded-full">
            {remoteUserName}
          </span>
        </div>

        {/* Local User Tile */}
        <div className="relative bg-gray-800 rounded-xl flex items-center justify-center border-2 border-indigo-500 overflow-hidden">
          {isVideoOn ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white text-2xl font-semibold">
                Y
              </div>
              <span className="text-gray-300 text-xs">You</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <VideoOff size={28} className="text-gray-500" />
              <span className="text-gray-500 text-xs">Camera Off</span>
            </div>
          )}
          {isScreenSharing && (
            <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
              Sharing
            </div>
          )}
          <span className="absolute bottom-2 left-3 text-xs text-gray-400 bg-black/50 px-2 py-0.5 rounded-full">
            You (local)
          </span>
        </div>
      </div>

      {/* ── Controls Bar ── */}
      <div className="flex items-center justify-center gap-4 py-5 bg-gray-900 border-t border-gray-800">

        {/* Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          title={isMuted ? "Unmute" : "Mute"}
          className={`p-3 rounded-full transition-all ${
            isMuted
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        {/* Start / End Call */}
        <button
          onClick={handleToggleCall}
          title={isCallActive ? "End Call" : "Start Call"}
          className={`p-4 rounded-full transition-all shadow-lg ${
            isCallActive
              ? "bg-red-600 hover:bg-red-700 text-white scale-110"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isCallActive ? <PhoneOff size={24} /> : <PhoneCall size={24} />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          title={isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
          className={`p-3 rounded-full transition-all ${
            !isVideoOn
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* Screen Share */}
        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          title="Screen Share"
          className={`p-3 rounded-full transition-all ${
            isScreenSharing
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-700 hover:bg-gray-600 text-white"
          }`}
        >
          <MonitorUp size={20} />
        </button>

      </div>

      {/* ── Status Bar ── */}
      <div className="text-center text-xs text-gray-500 py-2 bg-gray-900">
        {isCallActive
          ? "Enjoy your call! Use the controls below to manage your audio and video."
          : "Ready to connect? Click the green button to start your video call."}
      </div>
    </div>
  );
};

export default VideoCall;