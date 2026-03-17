export interface Session {
  id: string;
  userId: string;
  name: string;
  startTime: string;
  endTime: string | null;
  duration: number; // in seconds
  tag: 'Coding' | 'Study' | 'Revision' | 'Other';
  isActive: boolean;
}

export const getSessions = (userId: string): Session[] => {
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
  return sessions.filter((s: Session) => s.userId === userId);
};

export const createSession = (userId: string, name: string, tag: string): Session => {
  console.log('Creating session:', { userId, name, tag });
  
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
  console.log('Current sessions:', sessions);
  
  const newSession: Session = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    name,
    startTime: new Date().toISOString(),
    endTime: null,
    duration: 0,
    tag: tag as any,
    isActive: true,
  };
  
  sessions.push(newSession);
  localStorage.setItem('sessions', JSON.stringify(sessions));
  console.log('Session saved:', newSession);
  return newSession;
};

export const updateSession = (sessionId: string, updates: Partial<Session>): Session | null => {
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
  const index = sessions.findIndex((s: Session) => s.id === sessionId);
  
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates };
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return sessions[index];
  }
  return null;
};

export const endSession = (sessionId: string): Session | null => {
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
  const index = sessions.findIndex((s: Session) => s.id === sessionId);
  
  if (index !== -1) {
    const endTime = new Date().toISOString();
    const startTime = new Date(sessions[index].startTime);
    const duration = Math.floor((new Date(endTime).getTime() - startTime.getTime()) / 1000);
    
    sessions[index] = {
      ...sessions[index],
      endTime,
      duration,
      isActive: false,
    };
    
    localStorage.setItem('sessions', JSON.stringify(sessions));
    return sessions[index];
  }
  return null;
};

export const getActiveSession = (userId: string): Session | null => {
  const sessions = getSessions(userId);
  console.log('Getting active session for user:', userId, 'Available sessions:', sessions);
  const activeSession = sessions.find(s => s.isActive) || null;
  console.log('Active session found:', activeSession);
  return activeSession;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getTodaySessions = (userId: string): Session[] => {
  const sessions = getSessions(userId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sessions.filter(s => {
    const sessionDate = new Date(s.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });
};

export const getTotalHoursToday = (userId: string): number => {
  const todaySessions = getTodaySessions(userId);
  const totalSeconds = todaySessions.reduce((acc, s) => acc + s.duration, 0);
  return totalSeconds / 3600;
};
