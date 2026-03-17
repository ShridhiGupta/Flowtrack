import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Wallet, Mail, Lock, User as UserIcon, Clock, Briefcase } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { register, connectWallet, isAuthenticated } from "../lib/auth";
import { useEffect } from "react";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Developer");
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };
  
  const handleWalletConnect = async () => {
    const address = await connectWallet();
    if (address) {
      alert(`Wallet connected: ${address}\nIn production, this would create an account.`);
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
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Register Card */}
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
              Join FlowTrack
            </h1>
            <p className="text-gray-400 text-sm mt-2">Start tracking your productivity</p>
          </div>
          
          {/* Register Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full Name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>
            
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
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-300">I am a</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="pl-10 bg-white/5 border-white/10 text-white focus:border-indigo-500/50 focus:ring-indigo-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0F1419] border-white/10 text-white">
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Designer">Designer</SelectItem>
                    <SelectItem value="Researcher">Researcher</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium py-6 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50"
            >
              Create Account
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
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
