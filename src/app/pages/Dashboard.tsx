import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, TrendingUp, Target, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Stopwatch } from "../components/Stopwatch";
import { getCurrentUser } from "../lib/auth";
import { getTodaySessions, getTotalHoursToday } from "../lib/sessions";
import { generateAIInsights } from "../lib/ai";

export function Dashboard() {
  const user = getCurrentUser();
  const [, setUpdateTrigger] = useState(0);
  const [todaySessions, setTodaySessions] = useState(user ? getTodaySessions(user.id) : []);
  const [totalHours, setTotalHours] = useState(user ? getTotalHoursToday(user.id) : 0);
  const [insights, setInsights] = useState(user ? generateAIInsights(getTodaySessions(user.id)) : null);
  
  const handleSessionUpdate = () => {
    setUpdateTrigger(prev => prev + 1);
    if (user) {
      const sessions = getTodaySessions(user.id);
      setTodaySessions(sessions);
      setTotalHours(getTotalHoursToday(user.id));
      setInsights(generateAIInsights(sessions));
    }
  };
  
  useEffect(() => {
    handleSessionUpdate();
  }, [user]);
  
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Let's make today productive! Track your focus sessions and boost your efficiency.
        </motion.p>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300">
              {totalHours.toFixed(1)}h
            </div>
          </div>
          <div className="text-sm text-gray-400">Total Hours Today</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300">
              {todaySessions.length}
            </div>
          </div>
          <div className="text-sm text-gray-400">Sessions Completed</div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-300">
              {todaySessions.length > 0 ? Math.floor((todaySessions.reduce((acc, s) => acc + s.duration, 0) / todaySessions.length) / 60) : 0}m
            </div>
          </div>
          <div className="text-sm text-gray-400">Avg Session Length</div>
        </div>
      </motion.div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stopwatch - Takes 2 columns */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-400" />
              Focus Timer
            </h2>
            <p className="text-gray-400 text-sm mt-1">Start tracking your productivity sessions</p>
          </div>
          <Stopwatch onSessionUpdate={handleSessionUpdate} />
        </motion.div>
        
        {/* AI Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Insights
            </h2>
            <p className="text-gray-400 text-sm mt-1">Powered by Gemini AI</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-2xl border border-white/10 p-6 backdrop-blur-sm space-y-4">
            {insights && (
              <>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2">Daily Summary</div>
                  <div className="text-white">{insights.summary}</div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Best Productivity Hours
                  </div>
                  <div className="text-lg font-semibold text-indigo-300">{insights.bestProductivityHours}</div>
                </div>
                
                {insights.suggestions.length > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-400 mb-3">💡 Suggestions</div>
                    <ul className="space-y-2">
                      {insights.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <ArrowRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {insights.weakFocusAreas.length > 0 && (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                    <div className="text-sm text-yellow-300 mb-2">⚠️ Areas to Improve</div>
                    <ul className="space-y-1">
                      {insights.weakFocusAreas.map((area, index) => (
                        <li key={index} className="text-sm text-yellow-200/80">• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Auto To-Do Section */}
      {insights && (insights.tasksCompleted.length > 0 || insights.suggestedTasks.length > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              AI-Generated Tasks
            </h2>
            <p className="text-gray-400 text-sm mt-1">Based on your session data</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.tasksCompleted.length > 0 && (
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-green-300">Completed Today</h3>
                </div>
                <ul className="space-y-2">
                  {insights.tasksCompleted.map((task, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {insights.suggestedTasks.length > 0 && (
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-blue-300">Suggested Next</h3>
                </div>
                <ul className="space-y-2">
                  {insights.suggestedTasks.map((task, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
