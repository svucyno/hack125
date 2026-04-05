import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  MessageSquare, 
  Mic, 
  MicOff, 
  AlertCircle,
  Clock,
  User,
  LogOut,
  Calendar,
  FileText
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const { 
    isListening, 
    transcript, 
    aiResponse, 
    isSpeaking, 
    startListening, 
    stopListening 
  } = useVoiceAssistant();

  const [records, setRecords] = useState([]);
  const [sosActive, setSosActive] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/records/my', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setRecords(res.data);
      } catch (err) {
        console.error('Error fetching records:', err.message);
      }
    };
    fetchRecords();
  }, []);

  const triggerSOS = () => {
    setSosActive(true);
    socket.emit('emergency_sos', {
      patientId: user._id,
      patientName: `${user.firstName} ${user.lastName}`,
      location: 'Main Hospital Wing A', // Mock location
      urgency: 'critical'
    });
    setTimeout(() => setSosActive(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-sky-600 p-2 rounded-lg">
            <Heart className="text-white fill-current" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 uppercase">MEDI-CONNECT</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role} ID: {user?._id.slice(-6)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold">
               {user?.firstName[0]}
            </div>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-red-600 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: AI & Emergency */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Voice Assistant Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <Activity className="text-sky-100" size={100} />
            </div>
            
            <div className="relative z-10">
              <span className="bg-sky-100 text-sky-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">AI Symptom Assistant</span>
              <h2 className="text-3xl font-bold mt-4 text-slate-800">How are you feeling today?</h2>
              <p className="text-slate-500 mt-2">Speak naturally or type your symptoms to receive immediate guidance.</p>
              
              <div className="mt-10 flex flex-col items-center">
                <button 
                  onClick={isListening ? stopListening : startListening}
                  className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isListening ? 'bg-red-500 scale-110 shadow-red-200' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'}`}
                >
                  {isListening ? <MicOff className="text-white" size={40} /> : <Mic className="text-white" size={40} />}
                </button>
                
                {isListening && <p className="mt-4 text-red-500 font-medium animate-pulse">Listening...</p>}
                
                <AnimatePresence>
                  {(transcript || aiResponse) && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 w-full space-y-4"
                    >
                      {transcript && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">You said</p>
                          <p className="text-slate-700 mt-1 italic">"{transcript}"</p>
                        </div>
                      )}
                      
                      {aiResponse && (
                        <div className="bg-sky-50 p-6 rounded-2xl border border-sky-100">
                          <div className="flex items-center gap-2 mb-2">
                             <MessageSquare className="text-sky-600" size={18} />
                             <p className="text-xs font-bold text-sky-600 uppercase tracking-widest">Assistant Guidance</p>
                          </div>
                          <p className="text-slate-800 leading-relaxed font-medium">{aiResponse}</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Emergency SOS Section */}
          <div className="bg-red-50 rounded-3xl p-8 border border-red-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
             <div className="bg-white p-4 rounded-2xl shadow-inner">
                <AlertCircle className="text-red-500" size={48} />
             </div>
             <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-red-900">Emergency Response</h3>
                <p className="text-red-700 mt-1">If you are in immediate danger or experiencing severe symptoms, use the SOS button.</p>
             </div>
             <button 
                onClick={triggerSOS}
                disabled={sosActive}
                className={`btn-medical btn-emergency min-w-[160px] h-20 text-xl uppercase tracking-tighter font-black ${sosActive ? 'bg-red-800 opacity-50' : ''}`}
             >
                {sosActive ? 'ALERT SENT' : 'SOS'}
             </button>
          </div>
        </div>

        {/* Right Column: Health Stats & Records */}
        <div className="space-y-8">
           
           {/* Quick Actions */}
           <div className="grid grid-cols-2 gap-4">
              <button className="heartbeat-card hover:bg-sky-600 hover:text-white flex flex-col items-center gap-3">
                 <Calendar className="text-sky-600 group-hover:text-white" size={24} />
                 <span className="text-sm font-bold">Book Visit</span>
              </button>
              <button className="heartbeat-card hover:bg-green-600 hover:text-white flex flex-col items-center gap-3">
                 <ShieldCheck className="text-green-600 group-hover:text-white" size={24} />
                 <span className="text-sm font-bold">My Logs</span>
              </button>
           </div>

           {/* Health Records List */}
           <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6 px-2">
                 <h3 className="text-lg font-bold text-slate-800">Medical History</h3>
                 <FileText size={20} className="text-slate-400" />
              </div>
              
              <div className="space-y-4 overflow-y-auto max-h-[500px] px-2 custom-scrollbar">
                {records.length > 0 ? records.map(record => (
                  <div key={record._id} className="p-4 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors group cursor-pointer bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${record.urgency === 'emergency' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {record.urgency}
                       </span>
                       <span className="text-xs text-slate-400 font-medium">
                          {new Date(record.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{record.symptoms}</p>
                    <p className="text-xs text-slate-500 mt-1">Dr. {record.doctor?.lastName}</p>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                     <Clock size={40} strokeWidth={1} />
                     <p className="mt-4 text-sm">No recent health records found.</p>
                  </div>
                )}
              </div>
           </div>

           {/* Privacy Disclaimer */}
           <div className="bg-blue-900 rounded-3xl p-6 text-white text-center">
              <ShieldCheck className="mx-auto mb-3" size={32} />
              <p className="text-xs font-bold leading-relaxed opacity-90 uppercase tracking-widest px-4">
                SECURE AES-256 PROTECTION ACTIVE
              </p>
           </div>
        </div>
      </main>

      {/* Global CSS for the scrollbar and other tweaks */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;
