import { Outlet, useNavigate, useLocation, Link } from "react-router";
import { 
  LayoutDashboard, 
  Clock, 
  BarChart3, 
  User, 
  Settings as SettingsIcon,
  LogOut,
  Wallet
} from "lucide-react";
import { getCurrentUser, logout } from "../lib/auth";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  console.log('Layout rendering - location:', location.pathname);
  
  useEffect(() => {
    // Commented out to test if it interferes with routing
    /*
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
    */
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/sessions', icon: Clock, label: 'Sessions' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/about-me', icon: User, label: 'About Me' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings' },
  ];
  
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0F1419]/80 backdrop-blur-xl border-r border-white/10 z-10">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                FlowTrack
              </h1>
              <p className="text-xs text-gray-400">Web3 Productivity</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all block ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 shadow-lg shadow-indigo-500/20' 
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#0F1419]/80 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <div className="text-gray-400">Current Time</div>
                <div className="text-lg font-mono font-semibold text-indigo-300">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true 
                  })}
                </div>
              </div>
              <div className="h-8 w-px bg-white/10"></div>
              <div className="text-sm text-gray-400">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user?.walletAddress && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                  <Wallet className="w-4 h-4 text-indigo-300" />
                  <span className="text-sm font-mono text-indigo-300">
                    {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-400">{user?.role}</div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-8 relative z-0">
          <div className="mb-4 text-sm text-gray-500">
            Current path: {location.pathname}
          </div>
          <div className="text-xs text-gray-600 mb-4">
            Debug: Outlet rendering...
          </div>
          <Outlet />
          <div className="text-xs text-gray-600 mt-4">
            Debug: Outlet rendered
          </div>
        </main>
      </div>
    </div>
  );
}
