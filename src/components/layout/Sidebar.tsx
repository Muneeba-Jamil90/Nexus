import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, Building2, CircleDollarSign, Users, Video,MessageCircle, 
  Bell, FileText, Settings, HelpCircle, Calendar,Wallet,ShieldCheck 
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) => 
      `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${
        isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`
    }
  >
    <span className="mr-3">{icon}</span>
    <span className="text-sm font-medium">{text}</span>
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const entrepreneurItems = [
    { to: '/dashboard/entrepreneur', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/calendar', icon: <Calendar size={20} />, text: 'Calendar' },
    { to: '/profile/entrepreneur/' + user.id, icon: <Building2 size={20} />, text: 'My Startup' },
    { to: '/investors', icon: <CircleDollarSign size={20} />, text: 'Find Investors' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/documents', icon: <FileText size={20} />, text: 'Documents' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Call' },
    { to:  '/payments',  icon: <Wallet size={18} />,text: 'Payment' },
    { to:  '/security',  icon: <ShieldCheck size={18} />,text: 'Security' },
  ];

  const investorItems = [
    { to: '/dashboard/investor', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/calendar', icon: <Calendar size={20} />, text: 'Calendar' },
    { to: '/profile/investor/' + user.id, icon: <CircleDollarSign size={20} />, text: 'My Portfolio' },
    { to: '/entrepreneurs', icon: <Users size={20} />, text: 'Find Startups' },
    { to: '/messages', icon: <MessageCircle size={20} />, text: 'Messages' },
    { to: '/notifications', icon: <Bell size={20} />, text: 'Notifications' },
    { to: '/deals', icon: <FileText size={20} />, text: 'Deals' },
    { to: '/video-call', icon: <Video size={20} />, text: 'Video Call' },
    { to:  '/payments',  icon: <Wallet size={18} />,text: 'Payment' },
    { to:  '/security',  icon: <ShieldCheck size={18} />,text: 'Security' },
  ];

  const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 hidden md:block">
      <div className="h-full flex flex-col p-4">
        <div className="flex-1 space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} to={item.to} icon={item.icon} text={item.text} />
          ))}
        </div>
        <div className="border-t border-gray-200 pt-4 mt-4 space-y-1">
          <SidebarItem to="/settings" icon={<Settings size={20} />} text="Settings" />
          <SidebarItem to="/help" icon={<HelpCircle size={20} />} text="Help & Support" />
        </div>
      </div>
    </div>
  );
};