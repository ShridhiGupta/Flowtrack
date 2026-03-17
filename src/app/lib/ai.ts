import { Session } from './sessions';

export interface AIInsight {
  summary: string;
  bestProductivityHours: string;
  weakFocusAreas: string[];
  suggestions: string[];
  tasksCompleted: string[];
  suggestedTasks: string[];
}

export const generateAIInsights = (sessions: Session[]): AIInsight => {
  // Mock AI insights - in production, this would call Gemini API
  
  if (sessions.length === 0) {
    return {
      summary: "No sessions tracked yet. Start tracking to get personalized insights!",
      bestProductivityHours: "Not enough data",
      weakFocusAreas: [],
      suggestions: ["Start your first session to get insights"],
      tasksCompleted: [],
      suggestedTasks: ["Create a productivity goal", "Track your first session"],
    };
  }
  
  const totalHours = sessions.reduce((acc, s) => acc + s.duration, 0) / 3600;
  
  // Analyze sessions by hour
  const hourlyProductivity: { [key: number]: number } = {};
  sessions.forEach(s => {
    const hour = new Date(s.startTime).getHours();
    hourlyProductivity[hour] = (hourlyProductivity[hour] || 0) + s.duration;
  });
  
  const mostProductiveHour = Object.entries(hourlyProductivity).reduce(
    (max, [hour, duration]) => (duration > max.duration ? { hour: parseInt(hour), duration } : max),
    { hour: 9, duration: 0 }
  );
  
  const bestHourRange = `${mostProductiveHour.hour}:00 - ${mostProductiveHour.hour + 2}:00`;
  
  // Generate insights based on session patterns
  const weakAreas: string[] = [];
  const suggestions: string[] = [];
  
  if (totalHours < 2) {
    weakAreas.push("Low total focus time");
    suggestions.push("Try to increase daily focus time to at least 4 hours");
  }
  
  const avgSessionDuration = sessions.reduce((acc, s) => acc + s.duration, 0) / sessions.length / 60;
  if (avgSessionDuration < 30) {
    weakAreas.push("Short session durations");
    suggestions.push("Try longer focused sessions (45-60 min) for better deep work");
  }
  
  // Extract tasks from session names
  const tasksCompleted = sessions.map(s => s.name).slice(0, 5);
  
  const suggestedTasks = [
    "Review today's completed tasks",
    "Practice advanced concepts",
    "Take a short break and stretch",
    "Plan tomorrow's focus areas",
  ];
  
  return {
    summary: `You worked ${totalHours.toFixed(1)} hours today across ${sessions.length} session${sessions.length > 1 ? 's' : ''}`,
    bestProductivityHours: bestHourRange,
    weakFocusAreas: weakAreas,
    suggestions: suggestions.length > 0 ? suggestions : [
      `You are most productive between ${bestHourRange}`,
      "Maintain consistent session lengths",
      "Consider short breaks between sessions",
    ],
    tasksCompleted,
    suggestedTasks,
  };
};
