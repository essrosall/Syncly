import { Bell, MoreHorizontal, Search, LayoutGrid } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-800/85" role="navigation" aria-label="Top utilities">
      <div className="flex h-20 w-full items-center gap-4 px-4 lg:pl-[19rem] lg:pr-5">

        <div className="hidden flex-1 items-center md:flex">
          <div className="flex w-full max-w-[640px] items-center gap-3 rounded-md border border-neutral-200 bg-white px-4 py-3 shadow-[0_10px_25px_rgba(17,25,43,0.05)] dark:border-neutral-700 dark:bg-neutral-800">
            <Search size={18} className="text-neutral-400 dark:text-neutral-500" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
            <span className="shrink-0 rounded-md bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">Shortcut keys</span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700" aria-label="Layout">
            <LayoutGrid size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700" aria-label="More actions">
            <MoreHorizontal size={18} />
          </button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
