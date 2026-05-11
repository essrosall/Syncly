import { Bell, MoreHorizontal, Search, LayoutGrid } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-neutral-50/95 backdrop-blur-xl" role="navigation" aria-label="Top utilities">
      <div className="flex h-20 w-full items-center gap-4 px-4 lg:pl-[19rem] lg:pr-5">

        <div className="hidden flex-1 items-center md:flex">
          <div className="flex w-full max-w-[640px] items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 shadow-[0_10px_25px_rgba(17,25,43,0.05)]">
            <Search size={18} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
            <span className="shrink-0 rounded-md bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-500">Shortcut keys</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100" aria-label="Layout">
            <LayoutGrid size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-100" aria-label="More actions">
            <MoreHorizontal size={18} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
