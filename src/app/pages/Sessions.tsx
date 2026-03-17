import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Filter, Calendar, Tag, Edit2, Trash2 } from "lucide-react";
import { getCurrentUser } from "../lib/auth";
import { getSessions, formatDuration, updateSession, Session } from "../lib/sessions";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { format } from "date-fns";

export function Sessions() {
  console.log('Sessions component rendering...');
  const user = getCurrentUser();
  const [sessions, setSessions] = useState<Session[]>(user ? getSessions(user.id) : []);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>(sessions);
  const [filterTag, setFilterTag] = useState<string>("All");
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  useEffect(() => {
    if (user) {
      const allSessions = getSessions(user.id).sort((a, b) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setSessions(allSessions);
      setFilteredSessions(allSessions);
    }
  }, [user]);
  
  useEffect(() => {
    let filtered = [...sessions];
    
    // Filter by tag
    if (filterTag !== "All") {
      filtered = filtered.filter(s => s.tag === filterTag);
    }
    
    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(s => {
        const sessionDate = format(new Date(s.startTime), 'yyyy-MM-dd');
        return sessionDate === filterDate;
      });
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredSessions(filtered);
  }, [sessions, filterTag, filterDate, searchQuery]);
  
  const handleEdit = (session: Session) => {
    setEditingId(session.id);
    setEditName(session.name);
  };
  
  const handleSaveEdit = (sessionId: string) => {
    if (editName.trim()) {
      updateSession(sessionId, { name: editName });
      if (user) {
        const updatedSessions = getSessions(user.id).sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        setSessions(updatedSessions);
      }
    }
    setEditingId(null);
    setEditName("");
  };
  
  const handleDelete = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      const allSessions = JSON.parse(localStorage.getItem('sessions') || '[]');
      const updated = allSessions.filter((s: Session) => s.id !== sessionId);
      localStorage.setItem('sessions', JSON.stringify(updated));
      
      if (user) {
        const updatedSessions = getSessions(user.id).sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        setSessions(updatedSessions);
      }
    }
  };
  
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Coding': return 'from-indigo-500/20 to-blue-500/20 border-indigo-500/30 text-indigo-300';
      case 'Study': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300';
      case 'Revision': return 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 text-cyan-300';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-300';
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
          Session History
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400"
        >
          View and manage all your productivity sessions
        </motion.p>
      </div>
      
      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-white/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Search</label>
            <Input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tag
            </label>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white focus:border-indigo-500/50 focus:ring-indigo-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0F1419] border-white/10 text-white">
                <SelectItem value="All">All Tags</SelectItem>
                <SelectItem value="Coding">Coding</SelectItem>
                <SelectItem value="Study">Study</SelectItem>
                <SelectItem value="Revision">Revision</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Date
            </label>
            <Input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-indigo-500/50 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        
        {(filterTag !== "All" || filterDate || searchQuery) && (
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Showing {filteredSessions.length} of {sessions.length} sessions
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterTag("All");
                setFilterDate("");
                setSearchQuery("");
              }}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </motion.div>
      
      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/5 rounded-xl border border-white/10 p-12 text-center"
          >
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No sessions found</h3>
            <p className="text-gray-500">
              {sessions.length === 0 
                ? "Start tracking your first session to see it here"
                : "Try adjusting your filters"
              }
            </p>
          </motion.div>
        ) : (
          filteredSessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/5 to-white/0 rounded-xl border border-white/10 p-6 backdrop-blur-sm hover:border-indigo-500/30 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {editingId === session.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(session.id)}
                          className="bg-indigo-500 hover:bg-indigo-600"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(null);
                            setEditName("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-white">{session.name}</h3>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r border ${getTagColor(session.tag)}`}>
                          <span className="text-xs font-medium">{session.tag}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(session.startTime), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      {format(new Date(session.startTime), 'hh:mm a')} - {session.endTime ? format(new Date(session.endTime), 'hh:mm a') : 'In Progress'}
                    </div>
                    
                    <div className="text-indigo-300 font-semibold">
                      Duration: {formatDuration(session.duration)}
                    </div>
                  </div>
                </div>
                
                {editingId !== session.id && !session.isActive && (
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(session)}
                      className="text-gray-400 hover:text-indigo-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(session.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
