import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Award, TrendingUp, Clock, Target, Zap, AlertCircle } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { getSessions, Session } from "../lib/sessions";
import { Progress } from "../components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { format, differenceInDays } from "date-fns";

export function AboutMe() {
  const user = getCurrentUser();
  const [sessions, setSessions] = useState<Session[]>(user ? getSessions(user.id) : []);
  
  useEffect(() => {
    if (user) {
      setSessions(getSessions(user.id));
    }
  }, [user]);
  
  // Calculate stats
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 3600;
  const avgSessionDuration = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length / 60) 
    : 0;
  
  const tagHours: { [key: string]: number } = {};
  sessions.forEach(s => {
    tagHours[s.tag] = (tagHours[s.tag] || 0) + (s.duration / 3600);
  });
  
  const hourlyProductivity: { [key: number]: number } = {};
  sessions.forEach(s => {
    const hour = new Date(s.startTime).getHours();
    hourlyProductivity[hour] = (hourlyProductivity[hour] || 0) + 1;
  });
  
  const mostProductiveHour = Object.entries(hourlyProductivity).reduce(
    (max, [hour, count]) => (count > max.count ? { hour: parseInt(hour), count } : max),
    { hour: 9, count: 0 }
  );
  
  // Determine strength and weak areas based on time of day
  const morningHours = [6, 7, 8, 9, 10, 11];
  const afternoonHours = [12, 13, 14, 15, 16, 17];
  const eveningHours = [18, 19, 20, 21, 22, 23];
  
  const morningSessions = sessions.filter(s => morningHours.includes(new Date(s.startTime).getHours()));
  const afternoonSessions = sessions.filter(s => afternoonHours.includes(new Date(s.startTime).getHours()));
  const eveningSessions = sessions.filter(s => eveningHours.includes(new Date(s.startTime).getHours()));
  
  const timeDistribution = [
    { period: 'Morning', count: morningSessions.length },
    { period: 'Afternoon', count: afternoonSessions.length },
    { period: 'Evening', count: eveningSessions.length },
  ];
  
  const strongestPeriod = timeDistribution.reduce((max, item) => 
    item.count > max.count ? item : max, timeDistribution[0]
  );
  
  const weakestPeriod = timeDistribution.reduce((min, item) => 
    item.count < min.count ? item : min, timeDistribution[0]
  );
  
  // Focus score (0-100)
  const focusScore = Math.min(100, Math.round((totalHours / Math.max(1, sessions.length * 2)) * 100));
  
  // Days since account creation
  const daysSinceJoined = user ? differenceInDays(new Date(), new Date(user.createdAt)) : 0;
  
  // Radar chart data for skills/focus
  const radarData = [
    { skill: 'Coding', value: Math.min(100, (tagHours['Coding'] || 0) * 10) },
    { skill: 'Study', value: Math.min(100, (tagHours['Study'] || 0) * 10) },
    { skill: 'Revision', value: Math.min(100, (tagHours['Revision'] || 0) * 10) },
    { skill: 'Consistency', value: Math.min(100, sessions.length * 5) },
    { skill: 'Focus', value: focusScore },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          About Me
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Your personal productivity profile and insights
        </motion.p>
      </div>
      
      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl border border-white/10 p-8 backdrop-blur-sm"
      >
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold shadow-lg shadow-indigo-500/30">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2">{user?.name}</h2>
            <div className="flex items-center gap-4 text-gray-400 mb-4">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {user?.role}
              </span>
              <span>•</span>
              <span>Member for {daysSinceJoined} days</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-indigo-300">{totalHours.toFixed(1)}h</div>
                <div className="text-sm text-gray-400">Total Tracked</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-300">{sessions.length}</div>
                <div className="text-sm text-gray-400">Total Sessions</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-cyan-300">{focusScore}</div>
                <div className="text-sm text-gray-400">Focus Score</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Patterns */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Productivity Patterns</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Morning Sessions (6 AM - 12 PM)</span>
                <span className="text-sm font-semibold text-indigo-300">{morningSessions.length}</span>
              </div>
              <Progress 
                value={(morningSessions.length / Math.max(1, sessions.length)) * 100} 
                className="h-2 bg-white/10"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Afternoon Sessions (12 PM - 6 PM)</span>
                <span className="text-sm font-semibold text-purple-300">{afternoonSessions.length}</span>
              </div>
              <Progress 
                value={(afternoonSessions.length / Math.max(1, sessions.length)) * 100} 
                className="h-2 bg-white/10"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Evening Sessions (6 PM - 12 AM)</span>
                <span className="text-sm font-semibold text-cyan-300">{eveningSessions.length}</span>
              </div>
              <Progress 
                value={(eveningSessions.length / Math.max(1, sessions.length)) * 100} 
                className="h-2 bg-white/10"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
            <div className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-indigo-400 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-indigo-300 mb-1">Peak Productivity</div>
                <div className="text-sm text-gray-300">
                  You work best around {mostProductiveHour.hour}:00 with most sessions in the {strongestPeriod.period.toLowerCase()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Skills Radar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold">Skills & Focus</h2>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis 
                dataKey="skill" 
                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
              />
              <Radar 
                name="Skills" 
                dataKey="value" 
                stroke="#06b6d4" 
                fill="#06b6d4" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      
      {/* Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-400" />
            <h2 className="text-xl font-bold">Strength Areas</h2>
          </div>
          
          <ul className="space-y-3">
            {strongestPeriod.count > 0 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <div className="font-medium text-green-300">Strong in {strongestPeriod.period} sessions</div>
                  <div className="text-sm text-gray-400">Most active during this time period</div>
                </div>
              </li>
            )}
            
            {avgSessionDuration >= 45 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <div className="font-medium text-green-300">Excellent session duration</div>
                  <div className="text-sm text-gray-400">Average {Math.floor(avgSessionDuration)} minutes per session</div>
                </div>
              </li>
            )}
            
            {sessions.length >= 5 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <div className="font-medium text-green-300">Consistent tracking</div>
                  <div className="text-sm text-gray-400">Regular session tracking habits</div>
                </div>
              </li>
            )}
            
            {Object.keys(tagHours).length >= 2 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                <div>
                  <div className="font-medium text-green-300">Diverse activities</div>
                  <div className="text-sm text-gray-400">Balanced across multiple session types</div>
                </div>
              </li>
            )}
            
            {sessions.length === 0 && (
              <li className="text-sm text-gray-400">Start tracking sessions to discover your strengths!</li>
            )}
          </ul>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold">Areas to Improve</h2>
          </div>
          
          <ul className="space-y-3">
            {weakestPeriod.count === 0 && sessions.length > 0 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2"></div>
                <div>
                  <div className="font-medium text-yellow-300">Low {weakestPeriod.period.toLowerCase()} consistency</div>
                  <div className="text-sm text-gray-400">Try scheduling sessions during this time</div>
                </div>
              </li>
            )}
            
            {avgSessionDuration < 30 && sessions.length > 0 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2"></div>
                <div>
                  <div className="font-medium text-yellow-300">Short session durations</div>
                  <div className="text-sm text-gray-400">Aim for 45-60 minute focus sessions</div>
                </div>
              </li>
            )}
            
            {totalHours < 10 && sessions.length > 0 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2"></div>
                <div>
                  <div className="font-medium text-yellow-300">Low total hours</div>
                  <div className="text-sm text-gray-400">Set a daily goal to increase tracked time</div>
                </div>
              </li>
            )}
            
            {sessions.length < 5 && (
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2"></div>
                <div>
                  <div className="font-medium text-yellow-300">Build tracking consistency</div>
                  <div className="text-sm text-gray-400">Track more sessions to establish patterns</div>
                </div>
              </li>
            )}
            
            {sessions.length === 0 && (
              <li className="text-sm text-gray-400">Start tracking to identify improvement areas!</li>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
