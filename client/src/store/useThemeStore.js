import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('dsa100_theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark'; // Default theme
};

const applyThemeClass = (theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }
};

// Apply initial class immediately on module load
const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

const useThemeStore = create((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('dsa100_theme', nextTheme);
    applyThemeClass(nextTheme);
    set({ theme: nextTheme });
  },
  setTheme: (newTheme) => {
    localStorage.setItem('dsa100_theme', newTheme);
    applyThemeClass(newTheme);
    set({ theme: newTheme });
  },
}));

export default useThemeStore;
