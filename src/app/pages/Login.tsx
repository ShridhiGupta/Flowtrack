import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Wallet, Mail, Lock, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { login, connectWallet, isAuthenticated } from "../lib/auth";
import { useEffect } from "react";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const user = login(email, password);
    if (user) {
      navigate('/dashboard');
    } else {
      setError("Invalid email or password");
    }
  };
  
  const handleWalletConnect = async () => {
    const address = await connectWallet();
    if (address) {
      // In production, this would authenticate via wallet signature
      // For demo, we'll just show the address
      alert(`Wallet connected: ${address}\nIn production, this would authenticate you.`);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Floating particles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#0F1419]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              FlowTrack
            </h1>
            <p className="text-gray-400 text-sm mt-2">Web3 Productivity Platform</p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-6 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50"
            >
              Sign In
            </Button>
          </form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#0F1419] text-gray-400">Or continue with</span>
            </div>
          </div>
          
          <Button
            type="button"
            onClick={handleWalletConnect}
            variant="outline"
            className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium py-6 transition-all"
          >
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign up
            </Link>
          </div>
          
          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-xs text-cyan-300 mb-2 font-medium">Demo Credentials:</p>
            <p className="text-xs text-cyan-200/70">Create an account or use any email/password combination to demo the app</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
