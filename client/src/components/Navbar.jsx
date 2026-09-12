import { Link, useNavigate, useLocation } from 'react-router-dom';
import { DoorOpen, Flame, LogOut, Zap, Sun, Moon, Sparkles, ShoppingBag, User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useThemeStore from '../store/useThemeStore';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout,
    isAuthenticated: state.isAuthenticated(),
  }));
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isLight = theme === 'light';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: '100 Doors', to: '/', icon: DoorOpen },
    { label: 'NeetCode 150', to: '/neetcode-150', icon: Zap },
    { label: 'Amazon 150', to: '/amazon-150', icon: ShoppingBag },
  ];

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-xl transition-all duration-300 ${
      isLight
        ? 'bg-white/85 border-b border-black/[0.08]'
        : 'bg-black/85 border-b border-white/[0.08]'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">

        {/* ── Left: Logo + Creator badge ── */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link to="/" className={`flex items-center gap-1.5 sm:gap-2 font-display shrink-0 ${
            isLight ? 'text-[#1d1d1f]' : 'text-white'
          }`}>
            <DoorOpen
              size={20}
              className="text-[#ff9500] shrink-0"
            />
            <span className="text-sm sm:text-lg tracking-wide whitespace-nowrap font-semibold">
              <span className="hidden sm:inline">DSA 100 DOORS</span>
              <span className="inline sm:hidden">D100D</span>
            </span>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
              {navLinks.map(({ label, to, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                      isActive
                        ? isLight
                          ? 'bg-white text-black shadow-sm font-bold'
                          : 'bg-white/[0.15] text-white shadow-sm font-bold'
                        : isLight
                        ? 'text-slate-600 hover:text-black hover:bg-black/[0.03]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon size={13} className={isActive ? 'text-[#ff9500]' : ''} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>

        {/* ── Right: Theme + Auth ── */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm min-w-0">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-xl border transition-all shrink-0 ${
              isLight
                ? 'bg-black/[0.04] border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.08]'
                : 'bg-white/[0.06] border-white/[0.08] text-[#ff9500] hover:bg-white/[0.1]'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {isLight ? <Moon size={17} /> : <Sun size={17} />}
          </button>

          {isAuthenticated && user && (
            <>
              {/* Streak */}
              <div className={`flex items-center gap-1 shrink-0 ${
                isLight ? 'text-[#ff3b30]' : 'text-[#ff9500]'
              }`} title={`${user.streak || 0}-day streak`}>
                <Flame size={15} />
                <span className="font-bold">{user.streak || 0}</span>
              </div>

              {/* Profile Link */}
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all ${
                  location.pathname === '/profile'
                    ? isLight
                      ? 'bg-orange-50 border-[#ff9500]/40 text-[#ff9500] shadow-sm font-bold'
                      : 'bg-[#ff9500]/15 border-[#ff9500]/40 text-[#ff9500] shadow-sm font-bold'
                    : isLight
                    ? 'bg-black/[0.04] border-black/[0.08] text-[#1d1d1f] hover:bg-black/[0.08]'
                    : 'bg-white/[0.06] border-white/[0.08] text-white hover:bg-white/[0.1]'
                }`}
                title="View your Hero Profile & Stats"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#ff9500] to-violet-500 flex items-center justify-center text-[11px] font-bold text-black shadow-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline truncate max-w-[7rem] font-medium font-mono text-xs">
                  {user.name}
                </span>
                <span className="hidden lg:inline text-[10px] font-mono text-slate-400 bg-black/5 dark:bg-white/10 px-1.5 py-0.2 rounded-full">
                  Lv.{user.level || 1}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-1 transition-colors shrink-0 p-1.5 rounded-xl ${
                  isLight
                    ? 'text-[#86868b] hover:text-[#ff3b30] hover:bg-black/[0.04]'
                    : 'text-white/40 hover:text-[#ff3b30] hover:bg-white/[0.06]'
                }`}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      {isAuthenticated && (
        <div className="flex md:hidden items-center justify-around px-2 py-1.5 border-t border-black/[0.04] dark:border-white/[0.06] text-xs font-mono">
          {navLinks.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1 py-1 px-2.5 rounded-lg ${
                  isActive
                    ? 'text-[#ff9500] font-bold bg-[#ff9500]/10'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={13} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
