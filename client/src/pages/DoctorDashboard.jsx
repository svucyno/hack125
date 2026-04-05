import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldAlert, 
  CheckCircle,
  XCircle,
  Search,
  ChevronRight,
  LogOut,
  Bell,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [newNote, setNewNote] = useState({ symptoms: '', diagnosis: '', prescription: '', urgency: 'routine' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emergency, setEmergency] = useState(null);

  useEffect(() => {
    socket.on('emergency_alert', (data) => {
       setEmergency(data);
       // Play sound or show persistent notification
       setTimeout(() => setEmergency(null), 10000);
    });

    return () => socket.off('emergency_alert');
  }, []);

  useEffect(() => {
    // Mocking appointment data for now
    setAppointments([
      { _id: '1', patient: { firstName: 'John', lastName: 'Doe', _id: 'p1' }, startTime: new Date(), status: 'confirmed', urgencyLevel: 'medium' },
      { _id: '2', patient: { firstName: 'Jane', lastName: 'Smith', _id: 'p2' }, startTime: new Date(Date.now() + 3600000), status: 'pending', urgencyLevel: 'low' },
    ]);
  }, []);

  const viewPatientRecords = async (patientId) => {
    setLoading(true);
    setError('');
    setSelectedPatient(patientId);
    try {
      const res = await axios.get(`http://localhost:5000/api/records/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPatientRecords(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: No active session found.');
      setPatientRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/records', {
        patient: selectedPatient,
        ...newNote
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Record added and encrypted successfully.');
      setNewNote({ symptoms: '', diagnosis: '', prescription: '', urgency: 'routine' });
      viewPatientRecords(selectedPatient);
    } catch (err) {
      alert('Failed to save record.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-sky-600 p-2 rounded-xl text-white shadow-lg shadow-sky-100">
               <Stethoscope size={24} />
            </div>
            <h1 className="font-black text-xl tracking-tight text-slate-800">DR. CONNECT</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-sky-50 text-sky-700 font-bold">
            <Calendar size={20} /> Appointments
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
            <Users size={20} /> My Patients
          </button>
          <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 font-bold transition-all">
            <Bell size={20} /> Notifications
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6">
             <div className="h-10 w-10 rounded-full bg-slate-200" />
             <div className="text-sm">
                <p className="font-bold text-slate-800">Dr. {user?.lastName}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{user?.specialization}</p>
             </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Emergency Overlay */}
      {emergency && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md animate-bounce">
          <div className="bg-red-600 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 border-4 border-white">
             <AlertCircle size={48} className="animate-pulse" />
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">CRITICAL EMERGENCY</p>
                <h4 className="text-xl font-black">{emergency.patientName}</h4>
                <p className="text-sm font-bold">Location: {emergency.location}</p>
             </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-1 uppercase tracking-widest text-xs font-bold">Today's Schedule: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Search patient ID or name..." />
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Appointment List */}
          <div className="xl:col-span-1 space-y-6">
            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs px-2">Upcoming Consultations</h3>
            {appointments.map(app => (
              <div 
                key={app._id} 
                onClick={() => viewPatientRecords(app.patient._id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer group ${selectedPatient === app.patient._id ? 'bg-white border-sky-600 shadow-xl shadow-sky-50' : 'bg-white border-slate-100 hover:border-sky-300 shadow-sm'}`}
              >
                <div className="flex items-center justify-between mb-4">
                   <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <User size={24} />
                   </div>
                   <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${app.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {app.status}
                   </span>
                </div>
                <h4 className="font-black text-lg text-slate-800">{app.patient.firstName} {app.patient.lastName}</h4>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium"><Clock size={14} /> {new Date(app.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  <div className="flex items-center gap-1.5 font-medium uppercase tracking-tighter text-xs px-2 py-0.5 bg-slate-100 rounded-lg">{app.urgencyLevel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Records & Action Area */}
          <div className="xl:col-span-2 space-y-8">
            {selectedPatient ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden mb-8">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-slate-800">Medical History Viewer</h3>
                     <div className="flex items-center gap-2 text-xs font-black text-sky-600 bg-sky-50 px-4 py-2 rounded-full uppercase tracking-widest">
                        <ShieldAlert size={14} /> Time-Limited Access Active
                     </div>
                  </div>

                  {loading ? (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">Validating Session...</div>
                  ) : error ? (
                    <div className="py-20 text-center flex flex-col items-center">
                       <XCircle className="text-red-500 mb-4" size={48} />
                       <p className="text-red-600 font-black text-lg">{error}</p>
                       <p className="text-slate-500 text-sm mt-1">Access is only granted during confirmed consultations.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-80 overflow-y-auto px-1 custom-scrollbar">
                       {patientRecords.length > 0 ? patientRecords.map(record => (
                         <div key={record._id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-sky-200 transition-all">
                            <div className="flex items-center justify-between mb-3">
                               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Dr. {record.doctor?.lastName} • {new Date(record.createdAt).toLocaleDateString()}</p>
                               <ChevronRight size={16} className="text-slate-300 group-hover:text-sky-500" />
                            </div>
                            <p className="font-bold text-slate-800 mb-1">{record.symptoms}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                               <div className="bg-white p-3 rounded-xl border border-slate-100">
                                  <p className="text-[10px] font-black text-sky-600 uppercase mb-1">Diagnosis</p>
                                  <p className="text-xs text-slate-700">{record.diagnosis}</p>
                               </div>
                               <div className="bg-white p-3 rounded-xl border border-slate-100">
                                  <p className="text-[10px] font-black text-green-600 uppercase mb-1">Prescription</p>
                                  <p className="text-xs text-slate-700">{record.prescription}</p>
                               </div>
                            </div>
                         </div>
                       )) : (
                         <p className="py-10 text-center text-slate-400 italic">No previous records available for this patient.</p>
                       )}
                    </div>
                  )}
                </div>

                {/* Consultation Note Area */}
                <div className="bg-white rounded-3xl border border-sky-600 p-8 shadow-xl shadow-sky-50">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                     <FileText className="text-sky-600" /> New Consultation Note
                  </h3>
                  <form onSubmit={handleAddRecord} className="space-y-6">
                    <textarea 
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 text-sm"
                      placeholder="Observed symptoms..."
                      value={newNote.symptoms}
                      onChange={(e) => setNewNote({...newNote, symptoms: e.target.value})}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase px-1">Diagnosis (Encrypted)</label>
                        <input 
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                          value={newNote.diagnosis}
                          onChange={(e) => setNewNote({...newNote, diagnosis: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase px-1">Prescription (Encrypted)</label>
                        <input 
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                          value={newNote.prescription}
                          onChange={(e) => setNewNote({...newNote, prescription: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-6 pt-4">
                       <select 
                         className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 outline-none"
                         value={newNote.urgency}
                         onChange={(e) => setNewNote({...newNote, urgency: e.target.value})}
                       >
                          <option value="routine">Routine</option>
                          <option value="urgent">Urgent</option>
                          <option value="emergency">Emergency</option>
                       </select>
                       <button type="submit" className="flex-1 btn-medical btn-primary py-4">
                         <CheckCircle size={20} /> Complete Session & Save
                       </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-20 py-40">
                 <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                    <User size={40} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-400">Select a patient consultation to view details</h3>
                 <p className="text-slate-300 text-sm mt-1 max-w-xs">Data access is strictly monitored and limited to active sessions only.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
