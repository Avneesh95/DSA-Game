import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, DoorOpen, Sun, Moon, Sparkles, User, Mail, Lock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';
import Footer from '../components/Footer';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const isLight = theme === 'light';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(name, email, password);
    if (result.success) navigate('/');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      isLight ? 'bg-white' : ''
    }`}>
      {/* ── Top bar ── */}
      <header className={`border-b px-4 py-3 flex items-center justify-between backdrop-blur-xl transition-all ${
        isLight
          ? 'border-black/[0.06] bg-white/82'
          : 'border-white/[0.08] bg-black/80'
      }`}>
        <div className="flex items-center gap-2">
          <DoorOpen size={20} className="text-[#ff9500]" />
          <span className={`font-display text-base sm:text-lg font-semibold ${isLight ? 'text-[#1d1d1f]' : 'text-white'}`}>
            DSA 100 DOORS
          </span>
          <span className={`text-xs font-mono hidden sm:inline ${isLight ? 'text-[#86868b]' : 'text-white/40'}`}>
            | Created by <strong className="text-[#ff9500]">Avneesh</strong>
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className={`p-1.5 rounded-xl border transition-all ${
            isLight
              ? 'border-black/[0.08] bg-black/[0.04] text-[#1d1d1f] hover:bg-black/[0.08]'
              : 'border-white/[0.08] bg-white/[0.06] text-[#ff9500] hover:bg-white/[0.1]'
          }`}
          title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
        >
          {isLight ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </header>

      {/* ── Register Card ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className={`w-full max-w-sm rounded-2xl border p-7 transition-all ${
            isLight
              ? 'bg-white border-black/[0.08] shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
              : 'bg-[#1c1c1e] border-white/[0.08] shadow-[0_2px_40px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className={`p-3 rounded-2xl mb-3 ${isLight ? 'bg-[#ffcc00]/10' : 'bg-white/[0.06]'}`}>
              <KeyRound size={32} className="text-[#ffcc00]" />
            </div>
            <h1 className={`font-display text-xl font-semibold ${isLight ? 'text-[#1d1d1f]' : 'text-white'}`}>
              Forge Your Key
            </h1>
            <p className={`text-sm mt-1 ${isLight ? 'text-[#86868b]' : 'text-white/50'}`}>
              Create an account to begin your journey
            </p>
            <div className={`mt-2 inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
              isLight
                ? 'bg-[#ff9500]/8 border-[#ff9500]/15 text-[#bf5f00]'
                : 'bg-white/[0.04] border-white/[0.08] text-white/50'
            }`}>
              <Sparkles size={10} className="text-[#ff9500]" />
              <span>Built by <strong className="text-[#ff9500]">Avneesh</strong></span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm mb-1.5 font-medium ${isLight ? 'text-[#1d1d1f]' : 'text-white/70'}`} htmlFor="name">
                Name
              </label>
              <div className="relative">
                <User size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#86868b]' : 'text-white/30'}`} />
                <input
                  id="name"
                  type="text"
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight
                      ? 'bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f] focus:ring-[#ff9500]/30 focus:border-[#ff9500] placeholder-[#86868b]'
                      : 'bg-black/40 border-white/[0.1] text-white focus:ring-[#ff9500]/30 focus:border-[#ff9500] placeholder-white/25'
                  }`}
                  placeholder="Your adventurer name"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-1.5 font-medium ${isLight ? 'text-[#1d1d1f]' : 'text-white/70'}`} htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#86868b]' : 'text-white/30'}`} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight
                      ? 'bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f] focus:ring-[#ff9500]/30 focus:border-[#ff9500] placeholder-[#86868b]'
                      : 'bg-black/40 border-white/[0.1] text-white focus:ring-[#ff9500]/30 focus:border-[#ff9500] placeholder-white/25'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm mb-1.5 font-medium ${isLight ? 'text-[#1d1d1f]' : 'text-white/70'}`} htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#86868b]' : 'text-white/30'}`} />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 ${
                    isLight
                      ? 'bg-[#f5f5f7] border-black/[0.08] text-[#1d1d1f] focus:ring-[#ff9500]/30 focus:border-[#ff9500] placeholder-[#86868b]'
                      : 'bg-black/40 border-white/[0.1] text-white focus:ring-[#ff9500]/30 focus:border-[#ff9500] placeholder-white/25'
                  }`}
                  placeholder="At least 8 characters, incl. a number"
                />
              </div>
            </div>

            {error && (
              <p className={`text-sm px-3 py-2 rounded-xl border ${
                isLight
                  ? 'bg-[#ff3b30]/8 border-[#ff3b30]/15 text-[#ff3b30]'
                  : 'bg-[#ff3b30]/10 border-[#ff3b30]/20 text-[#ff3b30]'
              }`}>{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white disabled:opacity-60 transition-all
                bg-[#ff9500] hover:brightness-110 shadow-[0_2px_12px_rgba(255,149,0,0.35)] hover:shadow-[0_4px_18px_rgba(255,149,0,0.45)] hover:-translate-y-0.5"
            >
              {isLoading ? 'Forging Key...' : 'Create Account →'}
            </button>
          </form>

          <p className={`text-center text-sm mt-5 ${isLight ? 'text-[#86868b]' : 'text-white/40'}`}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#ff9500] hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
