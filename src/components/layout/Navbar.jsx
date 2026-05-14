import { Bell, MoreHorizontal, Search, LayoutGrid, X, CheckCircle, Briefcase, Settings, BookOpen, BarChart3, ArrowRight, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useMobileNav } from '../../contexts/MobileNavContext';
import { useLayout } from '../../contexts/LayoutContext';
import { NotificationsPanel, LayoutModal, MoreMenu } from '../ui';

const Navbar = ({ onNotifications = () => {}, onMore = () => {}, onLayout = () => {} }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { toggleSidebar } = useMobileNav();
  const { sidebarWidth } = useLayout();

  const navbarPaddingClass = {
    compact: 'lg:pl-60',
    wide: 'lg:pl-[19rem]',
    full: 'lg:pl-[25rem]',
  }[sidebarWidth] || 'lg:pl-[19rem]';

  // System-wide search data
  const systemData = {
    pages: [
      { id: 1, type: 'page', name: 'Dashboard', description: 'Overview and metrics', path: '/', icon: 'Dashboard' },
      { id: 2, type: 'page', name: 'Tasks', description: 'Manage your tasks', path: '/tasks#tasks-overview', icon: 'CheckCircle' },
      { id: 3, type: 'page', name: 'Workspaces', description: 'View all workspaces', path: '/workspaces#workspaces-overview', icon: 'Briefcase' },
      { id: 4, type: 'page', name: 'Analytics', description: 'View statistics', path: '/analytics', icon: 'BarChart3' },
      { id: 5, type: 'page', name: 'Settings', description: 'Configure preferences', path: '/settings#settings-overview', icon: 'Settings' },
    ],
    workspaces: [
      { id: 1, type: 'workspace', name: 'Product Design', description: 'Main project workspace', path: '/workspaces#workspace-product-design' },
      { id: 2, type: 'workspace', name: 'Mobile App', description: 'UI components and styles', path: '/workspaces#workspace-mobile-app' },
      { id: 3, type: 'workspace', name: 'Backend Services', description: 'Campaign management', path: '/workspaces#workspace-backend-services' },
    ],
    resources: [
      { id: 1, type: 'resource', name: 'Documentation', description: 'API and usage guides', path: '/settings#settings-documentation' },
      { id: 2, type: 'resource', name: 'Tutorials', description: 'Learning materials', path: '/settings#settings-tutorials' },
      { id: 3, type: 'resource', name: 'Community', description: 'User forum and discussions', path: '/settings#settings-community' },
    ],
    // Sections inside pages (sidebar sections, settings subsections, etc.)
    sections: [
      { id: 101, type: 'section', name: 'Profile', description: 'Edit your profile information', path: '/settings#settings-profile', parent: { id: 5, name: 'Settings' } },
      { id: 102, type: 'section', name: 'Notifications', description: 'Manage notification preferences', path: '/settings#settings-notifications', parent: { id: 5, name: 'Settings' } },
      { id: 103, type: 'section', name: 'Security', description: 'Password and security options', path: '/settings#settings-security', parent: { id: 5, name: 'Settings' } },
      { id: 201, type: 'section', name: 'Tasks Overview', description: 'Your active and completed tasks', path: '/tasks#tasks-overview', parent: { id: 2, name: 'Tasks' } },
      { id: 202, type: 'section', name: 'Create Task', description: 'Quick create a new task', path: '/tasks#task-create', parent: { id: 2, name: 'Tasks' } },
      { id: 301, type: 'section', name: 'Workspace Members', description: 'Manage workspace members', path: '/workspaces#workspace-members', parent: { id: 3, name: 'Workspaces' } },
    ],
  };

  // Popular/most visited suggestions shown when search bar is focused (no search term)
  const popularSuggestions = [
    systemData.pages[1], // Tasks
    systemData.sections[0], // Profile
    systemData.pages[0], // Dashboard
  ].slice(0, 3);

  // Generate system-wide suggestions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Show popular suggestions when search is focused but empty
      if (isSearchFocused) {
        setSuggestions(popularSuggestions);
      } else {
        setSuggestions([]);
      }
      return;
    }

    const query = searchTerm.toLowerCase();
    
    const pageResults = systemData.pages
      .filter(page => page.name.toLowerCase().includes(query) || page.description.toLowerCase().includes(query))
      .slice(0, 3);

    const workspaceResults = systemData.workspaces
      .filter(ws => ws.name.toLowerCase().includes(query) || ws.description.toLowerCase().includes(query))
      .slice(0, 2);

    const resourceResults = systemData.resources
      .filter(resource => resource.name.toLowerCase().includes(query) || resource.description.toLowerCase().includes(query))
      .slice(0, 2);

    const sectionResults = (systemData.sections || [])
      .filter(section => section.name.toLowerCase().includes(query) || section.description.toLowerCase().includes(query) || (section.parent && section.parent.name.toLowerCase().includes(query)))
      .slice(0, 4);

    // Combine results and prioritize pages, then sections (so users see subsections clearly)
    setSuggestions([...pageResults, ...sectionResults, ...workspaceResults, ...resourceResults]);
    setActiveSuggestionIndex(-1);
  }, [searchTerm, isSearchFocused]);

  // Add Cmd+K / Ctrl+K keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      // Close suggestions on Escape
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
    setActiveSuggestionIndex(-1);
    searchInputRef.current?.focus();
  };

  const navigateToPath = (path) => {
    navigate(path);

    const hashIndex = path.indexOf('#');
    if (hashIndex !== -1) {
      const targetId = path.slice(hashIndex + 1);
      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'Dashboard': <BarChart3 size={18} className="text-primary-500" />,
      'CheckCircle': <CheckCircle size={18} className="text-primary-500" />,
      'Briefcase': <Briefcase size={18} className="text-warning-500" />,
      'BarChart3': <BarChart3 size={18} className="text-info-500" />,
      'Settings': <Settings size={18} className="text-neutral-500" />,
    };
    return iconMap[iconName] || <Search size={18} className="text-primary-500" />;
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.path) {
      navigateToPath(suggestion.path);
    }

    setSearchTerm('');
    setActiveSuggestionIndex(-1);
    setIsSearchFocused(false);
  };

  const handleSearchKeyDown = (e) => {
    if (!suggestions.length) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const selectedSuggestion = suggestions[activeSuggestionIndex] || suggestions[0];
      if (selectedSuggestion) {
        handleSuggestionClick(selectedSuggestion);
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white/95 backdrop-blur-xl dark:border-neutral-700/80 dark:bg-neutral-800/85" role="navigation" aria-label="Top utilities">
      <div className={`flex h-20 w-full items-center gap-2 px-3 sm:gap-4 sm:px-4 lg:pr-5 ${navbarPaddingClass}`}>
        {/* Mobile hamburger menu */}
        <button
          onClick={toggleSidebar}
          className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          aria-label="Toggle navigation menu"
          title="Menu"
        >
          <Menu size={18} />
        </button>

        <div className="relative hidden flex-1 items-center sm:flex">
          <div className={`flex w-full max-w-[640px] items-center gap-3 rounded-md border transition-colors ${isSearchFocused ? 'border-primary-500 bg-white dark:border-primary-500 dark:bg-neutral-800' : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'} px-4 py-3 shadow-[0_10px_25px_rgba(17,25,43,0.05)]`}>
            <Search size={18} className="text-neutral-400 dark:text-neutral-500" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search everything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSearchKeyDown}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="flex-shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <span className="shrink-0 rounded-md px-2 py-1 text-xs font-medium text-neutral-400 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">CTRL + K</span>
          </div>

          {/* System-wide Suggestions Dropdown */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 w-full max-w-[640px] rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-50">
              <div className="max-h-96 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full px-4 py-3 text-left border-b border-neutral-200 dark:border-neutral-700 last:border-b-0 transition-colors ${
                      index === activeSuggestionIndex
                        ? 'bg-neutral-100 dark:bg-neutral-700'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {suggestion.type === 'page' && getIconComponent(suggestion.icon)}
                        {suggestion.type === 'workspace' && <Briefcase size={18} className="text-warning-500" />}
                        {suggestion.type === 'resource' && <BookOpen size={18} className="text-success-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {suggestion.name}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                          {suggestion.description}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                          {suggestion.type === 'page' && 'Page'}
                          {suggestion.type === 'workspace' && 'Workspace'}
                          {suggestion.type === 'resource' && 'Resource'}
                          {suggestion.type === 'section' && `Section • ${suggestion.parent?.name || 'Unknown'}`}
                        </p>
                        {suggestion.type === 'section' && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Located in {suggestion.parent?.name}</p>
                        )}
                      </div>

                      {/* Right-side action: go-to icon */}
                      <div className="ml-3 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (suggestion.path) navigateToPath(suggestion.path);
                          }}
                          aria-label={`Go to ${suggestion.name}`}
                          title={`Go to ${suggestion.name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        >
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:gap-3 relative">
          <button 
            onClick={() => {
              setIsLayoutOpen(!isLayoutOpen);
              setIsNotificationsOpen(false);
              setIsMoreOpen(false);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700" 
            aria-label="Layout"
            title="Toggle layout"
          >
            <LayoutGrid size={18} />
          </button>
          <LayoutModal isOpen={isLayoutOpen} onClose={() => setIsLayoutOpen(false)} />

          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsLayoutOpen(false);
              setIsMoreOpen(false);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 relative" 
            aria-label="Notifications"
            title="View notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <NotificationsPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

          <button 
            onClick={() => {
              setIsMoreOpen(!isMoreOpen);
              setIsLayoutOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700" 
            aria-label="More actions"
            title="More options"
          >
            <MoreHorizontal size={18} />
          </button>
          <MoreMenu isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} />

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

