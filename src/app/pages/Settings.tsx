import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Settings as SettingsIcon, Clock, Bell, Wallet, Download, Moon, Sun, Globe } from "lucide-react";
import { getCurrentUser, connectWallet } from "../lib/auth";
import { getSessions } from "../lib/sessions";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

export function Settings() {
  const user = getCurrentUser();
  const [timezone, setTimezone] = useState("America/New_York");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    dailySummary: true,
    weeklyReport: false,
  });
  const [walletAddress, setWalletAddress] = useState(user?.walletAddress || "");
  
  const handleConnectWallet = async () => {
    const address = await connectWallet();
    if (address) {
      setWalletAddress(address);
      
      // Update user in localStorage
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, walletAddress: address };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success("Wallet connected successfully!");
    } else {
      toast.error("Failed to connect wallet");
    }
  };
  
  const handleExportData = (format: 'csv' | 'json') => {
    if (!user) return;
    
    const sessions = getSessions(user.id);
    
    if (format === 'json') {
      const data = JSON.stringify(sessions, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flowtrack-sessions-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success("Data exported as JSON");
    } else {
      // CSV export
      const headers = ['Session Name', 'Tag', 'Start Time', 'End Time', 'Duration (minutes)'];
      const rows = sessions.map(s => [
        s.name,
        s.tag,
        new Date(s.startTime).toLocaleString(),
        s.endTime ? new Date(s.endTime).toLocaleString() : 'In Progress',
        Math.floor(s.duration / 60)
      ]);
      
      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flowtrack-sessions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success("Data exported as CSV");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Customize your FlowTrack experience
        </motion.p>
      </div>
      
      {/* Timezone Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold">Time & Region</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-gray-300">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-indigo-500/50 focus:ring-indigo-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1419] border-white/10 text-white">
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-400">Sessions will be tracked in this timezone</p>
          </div>
        </div>
      </motion.div>
      
      {/* Theme Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-gray-400">Currently: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
          <p className="text-sm text-gray-400">Dark mode is enabled by default (Light mode coming soon)</p>
        </div>
      </motion.div>
      
      {/* Notification Settings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <div className="font-medium">Session Reminders</div>
              <div className="text-sm text-gray-400">Get reminded to start your daily sessions</div>
            </div>
            <Switch
              checked={notifications.sessionReminders}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, sessionReminders: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <div className="font-medium">Daily Summary</div>
              <div className="text-sm text-gray-400">Receive end-of-day productivity summary</div>
            </div>
            <Switch
              checked={notifications.dailySummary}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, dailySummary: checked })
              }
            />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <div className="font-medium">Weekly Report</div>
              <div className="text-sm text-gray-400">Get weekly analytics and insights</div>
            </div>
            <Switch
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => 
                setNotifications({ ...notifications, weeklyReport: checked })
              }
            />
          </div>
        </div>
      </motion.div>
      
      {/* Wallet Connection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold">Web3 Wallet</h2>
        </div>
        
        <div className="space-y-4">
          {walletAddress ? (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-green-300 font-medium">Wallet Connected</div>
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              </div>
              <div className="font-mono text-sm text-gray-300 break-all">
                {walletAddress}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm text-gray-400 mb-3">
                Connect your Web3 wallet for enhanced features
              </div>
              <Button
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Data Export */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-orange-400" />
          <h2 className="text-xl font-bold">Data Export</h2>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Export your session data for backup or analysis in external tools
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={() => handleExportData('csv')}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            
            <Button
              onClick={() => handleExportData('json')}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export as JSON
            </Button>
          </div>
        </div>
      </motion.div>
      
      {/* Account Info */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white/5 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="text-sm text-gray-400 space-y-2">
          <div className="flex justify-between">
            <span>Account ID:</span>
            <span className="font-mono text-gray-300">{user?.id}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="text-gray-300">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Member Since:</span>
            <span className="text-gray-300">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'N/A'}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
