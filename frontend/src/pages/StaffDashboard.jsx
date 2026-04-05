import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserPlus, 
  Files, 
  CreditCard, 
  Pill, 
  Clipboard, 
  Search, 
  Plus, 
  CheckCircle,
  FileText,
  DollarSign,
  HeartPulse,
  LogOut
} from 'lucide-react';
import axios from 'axios';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState([
     { _id: 'p1', firstName: 'John', lastName: 'Doe', email: 'john@gmail.com', status: 'Inpatient' },
     { _id: 'p2', firstName: 'Jane', lastName: 'Smith', email: 'jane@gmail.com', status: 'Outpatient' }
  ]);
  const [activeTab, setActiveTab] = useState('billing'); // registration, billing, records

  const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', email: '', role: 'patient' });
  const [billingData, setBillingData] = useState({ patientId: 'p1', consultationFee: 500, labFee: 200, medicineFee: 150 });

  const calculateTotal = () => {
     return billingData.consultationFee + billingData.labFee + billingData.medicineFee;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
           <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg shadow-emerald-100">
              <HeartPulse size={24} />
           </div>
           <h1 className="font-black text-xl tracking-tight text-slate-800 uppercase">MEDI-STAFF</h1>
        </div>
        
        <div className="flex items-center gap-6">
           <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Medical Staff</p>
           </div>
           <button onClick={logout} className="text-slate-400 hover:text-red-600 transition-colors">
              <LogOut size={20} />
           </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full p-8 gap-8">
         {/* Side Nav */}
         <aside className="w-64 space-y-3">
            <button 
              onClick={() => setActiveTab('billing')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'billing' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
               <CreditCard size={18} /> Billing & Claims
            </button>
            <button 
              onClick={() => setActiveTab('registration')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'registration' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
               <UserPlus size={18} /> New Registration
            </button>
            <button 
              onClick={() => setActiveTab('records')}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === 'records' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-100' : 'bg-white text-slate-500 border border-slate-100 hover:bg-slate-50'}`}
            >
               <Clipboard size={18} /> Lab Reports
            </button>
         </aside>

         {/* Content Area */}
         <main className="flex-1 space-y-8">
            
            {activeTab === 'billing' && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-800">Medical Expense Calculator</h3>
                        <span className="text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full">Secure Payment Gateway Ready</span>
                     </div>
                     
                     <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase px-1">Select Patient</label>
                              <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700">
                                 {patients.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName} (ID: {p._id})</option>)}
                              </select>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase px-1">Consultation Fee</label>
                                 <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700" value={billingData.consultationFee} onChange={e => setBillingData({...billingData, consultationFee: parseInt(e.target.value)})}/>
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase px-1">Lab Charges</label>
                                 <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700" value={billingData.labFee} onChange={e => setBillingData({...billingData, labFee: parseInt(e.target.value)})}/>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                                 <label className="text-[10px] font-black text-slate-400 uppercase px-1">Pharmacy/Medicine Expense</label>
                                 <div className="relative">
                                    <Pill className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="number" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700" value={billingData.medicineFee} onChange={e => setBillingData({...billingData, medicineFee: parseInt(e.target.value)})}/>
                                 </div>
                           </div>

                           <button className="w-full btn-medical bg-emerald-600 text-white hover:bg-emerald-700 py-4 shadow-xl shadow-emerald-50">
                              Generate Secure Invoice
                           </button>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                               <CreditCard size={120} />
                            </div>
                            <div className="relative z-10">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Billing Summary</p>
                               <h4 className="text-4xl font-black mb-8">₹{calculateTotal()}</h4>
                               
                               <div className="space-y-4 text-sm opacity-80 font-medium">
                                  <div className="flex justify-between"><span>Consultation</span> <span>+ ₹{billingData.consultationFee}</span></div>
                                  <div className="flex justify-between"><span>Lab Services</span> <span>+ ₹{billingData.labFee}</span></div>
                                  <div className="flex justify-between"><span>Pharmacy</span> <span>+ ₹{billingData.medicineFee}</span></div>
                                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between font-black text-white">
                                     <span>Total Due</span> <span>₹{calculateTotal()}</span>
                                  </div>
                               </div>
                            </div>
                            
                            <div className="mt-10 p-4 bg-slate-800 rounded-2xl flex items-center gap-3">
                               <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                               <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Encrypted Transaction Hash ID: MEDI_{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'registration' && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-2xl mx-auto">
                     <div className="text-center mb-10">
                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                           <UserPlus size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">New Patient Entry</h3>
                        <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-widest">Registering new healthcare profile</p>
                     </div>
                     
                     <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                           <input className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="First Name" />
                           <input className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="Last Name" />
                        </div>
                        <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="Email Address" />
                        <div className="grid grid-cols-2 gap-4">
                           <input className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm" placeholder="Phone Number" />
                           <input className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm" type="date" />
                        </div>
                        <button className="w-full btn-medical bg-emerald-600 text-white hover:bg-emerald-700 py-4 shadow-xl shadow-emerald-50">
                           Initialize Patient ID
                        </button>
                     </form>
                  </div>
               </div>
            )}

            {activeTab === 'records' && (
               <div className="animate-in fade-in slide-in-from-right-4 duration-500 grid gap-6 grid-cols-1">
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                     <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Lab Report Management</h3>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input className="pl-12 pr-6 py-3 bg-slate-50 border border-white rounded-xl w-64 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Search Patient ID..." />
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                           <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all cursor-pointer group">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500">
                                    <FileText size={20} />
                                 </div>
                                 <div>
                                    <p className="text-sm font-black text-slate-800">Blood Test Report_{i}24</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient: John Doe • 05 Apr 2026</p>
                                 </div>
                              </div>
                              <button className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                 Upload Results
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

         </main>
      </div>
    </div>
  );
};

export default StaffDashboard;
