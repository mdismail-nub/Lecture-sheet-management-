import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Mail, Lock, ArrowRight, ChevronLeft, AlertCircle, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.auth.login({ email, password });
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-navy-900/5 via-transparent to-transparent"></div>
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-navy-500/10 rounded-full blur-3xl"></div>

      <Link 
        to="/" 
        className="absolute top-12 left-12 flex items-center space-x-3 text-navy-400 hover:text-navy-950 transition-all duration-300 font-black text-xs uppercase tracking-[0.2em] group z-20"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:-translate-x-1 transition-transform border border-navy-50">
          <ChevronLeft className="h-5 w-5" />
        </div>
        <span>Back to Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-5 bg-navy-950 rounded-[2rem] mb-8 shadow-2xl shadow-navy-950/20 group hover:rotate-12 transition-transform duration-500">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-gold-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-4 w-4" />
              <span>Secure Access</span>
            </div>
            <h1 className="text-4xl font-display font-black text-navy-950 tracking-tight">Admin Portal</h1>
            <p className="text-navy-500 font-serif text-xl italic">Sign in to manage academic excellence.</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-navy-900/5 border border-navy-50 relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-paper rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center space-x-4 text-red-600 text-sm font-bold"
              >
                <div className="bg-white p-1.5 rounded-lg shadow-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                </div>
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all duration-300 shadow-inner"
                  placeholder="admin@nub.ac.bd"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-navy-400 uppercase tracking-[0.2em] ml-2">Password</label>
              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-navy-400 group-focus-within/input:text-navy-950 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-paper border-transparent focus:bg-white focus:border-navy-950 focus:ring-0 rounded-[1.5rem] text-sm font-bold transition-all duration-300 shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-navy-950 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-navy-800 transition-all duration-300 shadow-2xl shadow-navy-950/20 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              {!loading && <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
          </form>
          
          <div className="mt-12 pt-10 border-t border-navy-50 text-center relative z-10">
            <div className="inline-block px-6 py-4 bg-paper rounded-2xl border border-navy-50">
              <p className="text-[10px] text-navy-400 font-black uppercase tracking-[0.2em] mb-2">Demo Credentials</p>
              <div className="flex items-center justify-center space-x-4">
                <p className="text-xs font-black text-navy-950">admin@nub.ac.bd</p>
                <div className="h-4 w-px bg-navy-100"></div>
                <p className="text-xs font-black text-navy-950">admin123</p>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-12 text-center text-[10px] font-black text-navy-400 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} Northern University Bangladesh. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
