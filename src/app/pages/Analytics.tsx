import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, Clock, Target } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { getSessions, Session } from "../lib/sessions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export function Analytics() {
  const user = getCurrentUser();
  const [sessions, setSessions] = useState<Session[]>(user ? getSessions(user.id) : []);
  
  useEffect(() => {
    if (user) {
      setSessions(getSessions(user.id));
    }
  }, [user]);
  
  // Prepare data for charts
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(startOfDay(date), 'yyyy-MM-dd');
      const daySessions = sessions.filter(s => {
        const sessionDate = format(startOfDay(new Date(s.startTime)), 'yyyy-MM-dd');
        return sessionDate === dateStr;
      });
      
      const totalHours = daySessions.reduce((acc, s) => acc + s.duration, 0) / 3600;
      
      data.push({
        date: format(date, 'EEE'),
        hours: parseFloat(totalHours.toFixed(2)),
        sessions: daySessions.length,
      });
    }
    return data;
  };
  
  const getTagDistribution = () => {
    const tagCounts: { [key: string]: number } = {};
    sessions.forEach(s => {
      tagCounts[s.tag] = (tagCounts[s.tag] || 0) + (s.duration / 3600);
    });
    
    return Object.entries(tagCounts).map(([tag, hours]) => ({
      name: tag,
      value: parseFloat(hours.toFixed(2)),
    }));
  };
  
  const getHourlyDistribution = () => {
    const hourlyData: { [key: number]: number } = {};
    
    sessions.forEach(s => {
      const hour = new Date(s.startTime).getHours();
      hourlyData[hour] = (hourlyData[hour] || 0) + (s.duration / 3600);
    });
    
    const data = [];
    for (let i = 0; i < 24; i++) {
      data.push({
        hour: `${i.toString().padStart(2, '0')}:00`,
        hours: parseFloat((hourlyData[i] || 0).toFixed(2)),
      });
    }
    
    return data.filter(d => d.hours > 0);
  };
  
  const weeklyData = getLast7DaysData();
  const tagData = getTagDistribution();
  const hourlyData = getHourlyDistribution();
  
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 3600;
  const avgSessionDuration = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length / 60) 
    : 0;
  const mostProductiveTag = tagData.length > 0 
    ? tagData.reduce((max, item) => item.value > max.value ? item : max, tagData[0]).name 
    : 'N/A';
  
  const COLORS = {
    'Coding': '#6366f1',
    'Study': '#a855f7',
    'Revision': '#06b6d4',
    'Other': '#6b7280',
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
          Analytics Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          Visualize your productivity patterns and trends
        </motion.p>
      </div>
      
      {/* Summary Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300">{totalHours.toFixed(1)}h</div>
          </div>
          <div className="text-sm text-gray-400">Total Hours Tracked</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-300">{sessions.length}</div>
          </div>
          <div className="text-sm text-gray-400">Total Sessions</div>
        </div>
        
        <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-300">{Math.floor(avgSessionDuration)}m</div>
          </div>
          <div className="text-sm text-gray-400">Avg Session Length</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-green-300">{mostProductiveTag}</div>
          </div>
          <div className="text-sm text-gray-400">Top Activity</div>
        </div>
      </motion.div>
      
      {/* Charts */}
      {sessions.length > 0 ? (
        <>
          {/* Weekly Trend */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold">Last 7 Days Activity</h2>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F1419', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="hours" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tag Distribution */}
            {tagData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-bold">Session Distribution</h2>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tagData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {tagData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F1419', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="mt-4 space-y-2">
                  {tagData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || COLORS.Other }}
                        ></div>
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                      <span className="text-gray-400">{item.value.toFixed(1)}h</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Hourly Distribution */}
            {hourlyData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-bold">Peak Productivity Hours</h2>
                </div>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                      interval={2}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.7)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F1419', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#06b6d4" 
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 rounded-xl border border-white/10 p-12 text-center"
        >
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No analytics data yet</h3>
          <p className="text-gray-500">Start tracking sessions to see your productivity analytics</p>
        </motion.div>
      )}
    </div>
  );
}
