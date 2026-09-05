import { Code2, Heart, Sparkles } from 'lucide-react';
import useThemeStore from '../store/useThemeStore';

export default function Footer() {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <footer className={`w-full border-t py-4 px-4 mt-8 backdrop-blur-xl transition-all duration-300 ${
      isLight
        ? 'border-black/[0.06] bg-white/80 text-[#6e6e73]'
        : 'border-white/[0.06] bg-black/60 text-white/40'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className={`flex items-center gap-1.5 font-medium ${isLight ? 'text-[#1d1d1f]' : 'text-white/60'}`}>
          <Code2 size={16} className="text-[#ff9500]" />
          <span>DSA 100 Doors</span>
          <span className={`font-mono ${isLight ? 'text-black/20' : 'text-white/20'}`}>|</span>
          <span className={`text-xs font-semibold ${isLight ? 'text-[#6e6e73]' : 'text-white/50'}`}>100 Doors DSA Map</span>
        </div>

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-transform hover:scale-105 ${
          isLight
            ? 'bg-[#ff9500]/8 border-[#ff9500]/15 text-[#1d1d1f]'
            : 'bg-white/[0.04] border-white/[0.08]'
        }`}>
          <Sparkles size={13} className="animate-pulse shrink-0 text-[#ff9500]" />
          <span className={isLight ? 'text-[#6e6e73]' : 'text-white/50'}>Created with</span>
          <Heart size={13} className="text-[#ff3b30] fill-[#ff3b30] shrink-0" />
          <span className={isLight ? 'text-[#6e6e73]' : 'text-white/50'}>by</span>
          <span className="font-semibold tracking-wide text-[#ff9500]">Avneesh</span>
        </div>

        <div className={`text-xs ${isLight ? 'text-[#86868b]' : 'text-white/25'}`}>
          © {new Date().getFullYear()} Avneesh. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
