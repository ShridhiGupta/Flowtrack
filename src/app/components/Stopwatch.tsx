import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Pause, Square, Tag } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getCurrentUser } from "../lib/auth";
import { createSession, endSession, getActiveSession, formatDuration } from "../lib/sessions";

interface StopwatchProps {
  onSessionUpdate?: () => void;
}

export function Stopwatch({ onSessionUpdate }: StopwatchProps) {
  const user = getCurrentUser();
  const [activeSession, setActiveSession] = useState(user ? getActiveSession(user.id) : null);
  const [sessionName, setSessionName] = useState("");
  const [sessionTag, setSessionTag] = useState<string>("Coding");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const session = getActiveSession(user.id);
    setActiveSession(session);
    
    if (session && !isPaused) {
      const startTime = new Date(session.startTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        setElapsedTime(elapsed);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [user, isPaused, activeSession?.id]);
  
  const handleStart = () => {
    if (!user) return;
    
    if (!sessionName.trim()) {
      alert("Please enter a session name");
      return;
    }
    
    const session = createSession(user.id, sessionName, sessionTag);
    setActiveSession(session);
    setIsPaused(false);
    setElapsedTime(0);
    onSessionUpdate?.();
  };
  
  const handlePause = () => {
    setIsPaused(!isPaused);
  };
  
  const handleStop = () => {
    if (!activeSession) return;
    
    endSession(activeSession.id);
    setActiveSession(null);
    setSessionName("");
    setElapsedTime(0);
    setIsPaused(false);
    onSessionUpdate?.();
  };
  
  return (
    <div className="relative">
      <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl border border-white/10 p-8 backdrop-blur-sm">
        {/* Session Name Input */}
        {!activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-8"
          >
            <div className="space-y-2">
              <Label htmlFor="session-name" className="text-gray-300">Session Name</Label>
              <Input
                id="session-name"
                type="text"
                placeholder="e.g., Coding Session 1 - Binary Search"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session-tag" className="text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Session Type
              </Label>
              <Select value={sessionTag} onValueChange={setSessionTag}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-indigo-500/50 focus:ring-indigo-500/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0F1419] border-white/10 text-white">
                  <SelectItem value="Coding">Coding</SelectItem>
                  <SelectItem value="Study">Study</SelectItem>
                  <SelectItem value="Revision">Revision</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
        
        {/* Active Session Info */}
        {activeSession && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">Current Session</div>
                <div className="text-lg font-medium text-white">{activeSession.name}</div>
              </div>
              <div className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                <span className="text-sm text-indigo-300">{activeSession.tag}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Started at {new Date(activeSession.startTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
          </motion.div>
        )}
        
        {/* Stopwatch Display */}
        <div className="mb-8">
          <motion.div
            className="text-center"
            animate={{
              scale: activeSession && !isPaused ? [1, 1.02, 1] : 1,
            }}
            transition={{
              duration: 1,
              repeat: activeSession && !isPaused ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <div className="inline-block relative">
              {activeSession && !isPaused && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-3xl opacity-30 animate-pulse"></div>
              )}
              <div className="relative text-8xl font-mono font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {formatDuration(elapsedTime)}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              {!activeSession && "Ready to start tracking"}
              {activeSession && !isPaused && "Tracking in progress..."}
              {activeSession && isPaused && "Paused"}
            </div>
          </motion.div>
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!activeSession ? (
            <Button
              onClick={handleStart}
              className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Session
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="px-8 py-6 text-lg border-white/20 bg-white/5 hover:bg-white/10 text-white"
              >
                <Pause className="w-6 h-6 mr-2" />
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                onClick={handleStop}
                className="px-8 py-6 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/30 transition-all hover:shadow-red-500/50"
              >
                <Square className="w-6 h-6 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>
        
        {/* Session Stats */}
        {activeSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-xl font-semibold text-indigo-300">
                  {Math.floor(elapsedTime / 60)} min
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Status</div>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`}></div>
                  <div className="text-xl font-semibold text-white">
                    {isPaused ? 'Paused' : 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
