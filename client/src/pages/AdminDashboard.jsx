import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldCheck, 
  Users, 
  BarChart, 
  Activity, 
  History, 
  UserCheck, 
  UserX,
  Database,
  Lock,
  ChevronDown,
  AlertTriangle,
  Search,
  Bell
} from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [stats, setStats] = useState({ activePatients: 450, verifiedDoctors: 82, totalConsultations: 1240, uptime: '99.9%' });
  const [view, setView] = useState('overview'); // overview, audit, users

  useEffect(() => {
    // Mocking statistical and audit data
    setAuditLogs([
      { _id: '1', user: 'Dr. Smith', action: 'view_record', details: 'Accessed John Doe PHI', timestamp: new Date(), ip: '192.168.1.1' },
      { _id: '2', user: 'Patient John', action: 'login', details: 'Successful login', timestamp: new Date(Date.now() - 3600000), ip: '192.168.1.5' },
      { _id: '3', user: 'Admin Sarah', action: 'verify_doctor', details: 'Verified Dr. Allen', timestamp: new Date(Date.now() - 7200000), ip: '192.168.1.10' },
    ]);
    
    setActiveUsers([
      { _id: 'd1', firstName: 'Alice', lastName: 'Allen', role: 'doctor', isVerified: false, email: 'alice@med.com' },
      { _id: 'p1', firstName: 'Bob', lastName: 'Brown', role: 'patient', isVerified: true, email: 'bob@gmail.com' },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 p-2 rounded-lg text-white">
             <ShieldCheck size={24} />
          </div>
          <h1 className="font-black text-xl tracking-tighter">MEDI-ADMIN <span className="text-sky-500">PRO</span></h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-slate-700 pr-6">
             <Bell className="text-slate-400 hover:text-white cursor-pointer" size={20} />
             <Database className="text-slate-400 hover:text-white cursor-pointer" size={20} />
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-xs font-bold text-white uppercase tracking-widest">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-sky-400 font-black uppercase tracking-widest">System Admin</p>
             </div>
             <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
                <Lock size={20} />
             </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-slate-800 text-slate-300 p-6 space-y-4">
           <button 
             onClick={() => setView('overview')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'overview' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50' : 'hover:bg-slate-700 text-slate-400'}`}
           >
              <BarChart size={18} /> Dashboard Overview
           </button>
           <button 
             onClick={() => setView('audit')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'audit' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50' : 'hover:bg-slate-700 text-slate-400'}`}
           >
              <History size={18} /> Audit Logs
           </button>
           <button 
             onClick={() => setView('users')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${view === 'users' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/50' : 'hover:bg-slate-700 text-slate-400'}`}
           >
              <Users size={18} /> User Management
           </button>
           
           <div className="pt-10 space-y-4">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500">System Monitoring</p>
              <div className="px-4 py-3 bg-slate-900/40 rounded-xl border border-slate-700/50">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400">Server Status</span>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                 </div>
                 <p className="text-xs font-bold text-white">UPTIME: 99.98%</p>
              </div>
              <div className="px-4 py-3 bg-slate-900/40 rounded-xl border border-slate-700/50">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400">Database Load</span>
                    <span className="text-[10px] font-bold text-sky-400">NORMAL</span>
                 </div>
                 <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 w-1/4"></div>
                 </div>
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-10 overflow-y-auto">
          
          {view === 'overview' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                     <Users className="text-sky-600 mb-4" size={24} />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Patients</p>
                     <p className="text-3xl font-black text-slate-800 mt-1">{stats.activePatients}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                     <Activity className="text-green-600 mb-4" size={24} />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doctors Verified</p>
                     <p className="text-3xl font-black text-slate-800 mt-1">{stats.verifiedDoctors}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                     <ChevronDown className="text-purple-600 mb-4" size={24} />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Consultations</p>
                     <p className="text-3xl font-black text-slate-800 mt-1">{stats.totalConsultations}</p>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                     <AlertTriangle className="text-red-500 mb-4" size={24} />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Alerts</p>
                     <p className="text-3xl font-black text-slate-800 mt-1">0</p>
                  </div>
               </div>

               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                  <h3 className="text-xl font-black text-slate-800 mb-6">Real-Time Platform Activity</h3>
                  <div className="h-64 flex items-end justify-between gap-4 px-4 overflow-hidden">
                     {[40, 70, 45, 90, 65, 80, 55, 30, 85, 95, 60, 75].map((h, i) => (
                       <div key={i} className="flex-1 bg-sky-50 rounded-t-xl relative group">
                          <div 
                            className="absolute bottom-0 left-0 w-full bg-sky-500 rounded-t-xl transition-all duration-1000" 
                            style={{ height: `${h}%` }}
                          ></div>
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded">
                             {h * 10} active
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {view === 'audit' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                     <h3 className="text-xl font-black text-slate-800">Complete Audit Tracking System</h3>
                     <div className="flex gap-4">
                        <button className="bg-slate-50 border border-slate-200 text-[10px] font-black uppercase px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100">Export Report (PDF)</button>
                        <button className="bg-sky-600 border border-sky-700 text-[10px] font-black uppercase px-4 py-2 rounded-xl text-white shadow-lg shadow-sky-100">Backup DB Now</button>
                     </div>
                  </div>
                  
                  <div className="p-0">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / Action</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource / Details</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                          <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {auditLogs.map(log => (
                          <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs uppercase">{log.user[0]}</div>
                                  <div>
                                     <p className="text-sm font-bold text-slate-800">{log.user}</p>
                                     <p className="text-[10px] font-black text-sky-600 uppercase tracking-tighter">{log.action}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <p className="text-sm text-slate-700 font-medium">{log.details}</p>
                               <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">{log.resource}</p>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-500 font-mono">{log.ip}</td>
                            <td className="px-8 py-6 text-sm text-slate-500">{log.timestamp.toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}

          {view === 'users' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <header className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Manage Accounts <span className="text-slate-300 ml-2">({activeUsers.length})</span></h3>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-80 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Filter by role or name..." />
                  </div>
               </header>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeUsers.map(user => (
                    <div key={user._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 relative group overflow-hidden">
                       <div className="flex items-center justify-between mb-6">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${user.role === 'doctor' ? 'bg-sky-100 text-sky-700' : 'bg-green-100 text-green-700'}`}>{user.firstName[0]}</div>
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${user.role === 'doctor' ? 'bg-sky-50 text-sky-600' : 'bg-green-50 text-green-600'}`}>{user.role}</span>
                       </div>
                       <h4 className="text-lg font-black text-slate-800">{user.firstName} {user.lastName}</h4>
                       <p className="text-sm text-slate-400 font-medium mb-6">{user.email}</p>
                       
                       <div className="flex gap-2 pt-6 border-t border-slate-50">
                          {!user.isVerified && user.role === 'doctor' ? (
                            <button className="flex-1 bg-sky-600 text-white rounded-xl py-3 text-xs font-black uppercase shadow-lg shadow-sky-100 hover:bg-sky-700 flex items-center justify-center gap-2">
                               <UserCheck size={14} /> Verify Doctor
                            </button>
                          ) : (
                            <button className="flex-1 bg-slate-50 text-slate-400 rounded-xl py-3 text-xs font-black uppercase cursor-default flex items-center justify-center gap-2 italic">
                               Verified Account
                            </button>
                          )}
                          <button className="bg-red-50 text-red-500 h-10 w-10 flex items-center justify-center rounded-xl hover:bg-red-500 hover:text-white transition-all">
                             <UserX size={18} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
