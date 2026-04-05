import { useVoiceAssistant } from '../contexts/VoiceAssistantContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { lang, setLang, languages, isListening, startListening, stopListening, isSpeaking } = useVoiceAssistant();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
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

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-sky-100 overflow-hidden border border-slate-100 relative">
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <div className={`h-16 w-16 bg-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-200 transition-transform ${isSpeaking ? 'scale-110' : ''}`}>
              <Heart className="text-white fill-current" size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">MEDI-CONNECT</h1>
            <p className="text-slate-500 text-sm mt-1">{languages[lang].welcome}</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
              <Activity size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  placeholder="name@hospital.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="flex-1 btn-medical btn-primary py-4 text-lg">
                <LogIn size={20} />
                Sign In
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
          </form>

          <div className="mt-10 text-center text-sm text-slate-500">
            Don't have an account? <Link to="/register" className="text-sky-600 font-bold hover:underline">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
