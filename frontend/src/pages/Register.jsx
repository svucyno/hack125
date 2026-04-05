import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient',
    licenseNumber: '',
    specialization: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang, languages, isListening, startListening, stopListening, isSpeaking } = useVoiceAssistant();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'doctor' && !formData.licenseNumber) {
      return setError('License number is required for doctors');
    }
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-sky-50 relative overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-8 right-8 flex gap-2 z-50">
        {Object.keys(languages).map((l) => (
          <button 
            key={l} 
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${lang === l ? 'bg-sky-600 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
          >
            {languages[l].name}
          </button>
        ))}
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-sky-100 overflow-hidden border border-slate-100 p-10 relative">
        <div className="flex flex-col items-center mb-8">
          <div className={`h-16 w-16 bg-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-200 transition-transform ${isSpeaking ? 'scale-110' : ''}`}>
            <Heart className="text-white fill-current" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">MEDI-CONNECT</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-bold">{languages[lang].welcome}</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">First Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  placeholder="John"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Last Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                placeholder="john.doe@hospital.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Role Selection</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['patient', 'doctor', 'staff', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: r })}
                  className={`py-3 rounded-xl text-sm font-bold capitalize transition-all ${formData.role === r ? 'bg-sky-600 text-white shadow-lg shadow-sky-100 border-transparent' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {formData.role === 'doctor' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">License Number</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    placeholder="MC-12345"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Specialization</label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                    placeholder="Cardiologist"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Set Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="flex-1 btn-medical btn-primary py-4 text-lg">
              Create Secure Account
            </button>
            <button 
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`w-16 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-100' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}
            >
              {isListening ? (
                <div className="waveform">
                  <div className="bar"></div><div className="bar"></div><div className="bar"></div>
                </div>
              ) : <Activity size={24} />}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already a member? <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
