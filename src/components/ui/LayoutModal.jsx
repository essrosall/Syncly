import { LayoutGrid, List, X } from 'lucide-react';
import { useLayout } from '../../contexts/LayoutContext';

const LayoutModal = ({ isOpen, onClose }) => {
  const { layoutMode, setLayoutMode, sidebarWidth, setSidebarWidth } = useLayout();

  const previewSidebarWidthClass = {
    compact: 'w-10',
    wide: 'w-14',
    full: 'w-24',
  }[sidebarWidth] || 'w-14';

  const previewSidebarLabel = {
    compact: 'Compact',
    wide: 'Wide',
    full: 'Full Width',
  }[sidebarWidth] || 'Wide';

  const previewCards = layoutMode === 'grid'
    ? ['w-full', 'w-full']
    : ['w-full', 'w-full', 'w-full'];

  const layoutOptions = [
    {
      id: 'grid',
      name: 'Grid View',
      description: 'Display items in a grid layout',
      icon: LayoutGrid,
    },
    {
      id: 'list',
      name: 'List View',
      description: 'Display items in a list layout',
      icon: List,
    },
  ];

  const sidebarOptions = [
    { id: 'compact', name: 'Compact', width: 'w-56' },
    { id: 'wide', name: 'Wide (Default)', width: 'w-72' },
    { id: 'full', name: 'Full Width', width: 'w-screen' },
  ];

  return (
    <div className={`absolute right-0 top-full z-50 mt-2 w-[min(25rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl transition-all duration-200 dark:border-neutral-700 dark:bg-neutral-800 ${
      isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
    }`}>
        <div className="w-full bg-white dark:bg-neutral-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Layout Options</h3>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close layout options"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] space-y-6 overflow-y-auto px-4 py-4">
            {/* View Mode */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">View Mode</h4>
              <div className="grid grid-cols-2 gap-2">
                {layoutOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = layoutMode === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setLayoutMode(option.id)}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 px-3 py-4 transition-colors ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 text-primary-950 shadow-sm dark:bg-primary-900/30 dark:text-primary-50'
                          : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-500'
                      }`}
                    >
                      <Icon size={20} className={isSelected ? 'text-primary-600 dark:text-primary-300' : 'text-neutral-600 dark:text-neutral-400'} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-primary-950 dark:text-primary-50' : 'text-neutral-900 dark:text-neutral-100'}`}>
                        {option.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Width */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">Sidebar Width</h4>
              <div className="space-y-2">
                {sidebarOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSidebarWidth(option.id)}
                    className={`w-full rounded-lg border-2 px-3 py-2 text-left text-sm font-medium transition-colors ${
                      sidebarWidth === option.id
                                                  ? 'border-primary-500 bg-primary-50 text-primary-950 shadow-sm dark:bg-primary-900/30 dark:text-primary-50'
                          : 'border-neutral-200 bg-white text-neutral-900 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-500'
                    }`}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-900">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">Preview</p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-500">
                  {layoutMode === 'grid' ? 'Grid view' : 'List view'} • {sidebarWidth} sidebar
                </p>
              </div>

              <div className="mt-3 overflow-hidden rounded-md border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex gap-2">
                  <div className={`shrink-0 rounded-md bg-neutral-200 p-1.5 transition-all dark:bg-neutral-700 ${previewSidebarWidthClass}`}>
                    <div className="mb-1 h-1.5 w-full rounded-full bg-neutral-400/70" />
                    <div className="mb-1 h-1.5 w-3/4 rounded-full bg-neutral-400/70" />
                    <div className="h-1.5 w-2/3 rounded-full bg-neutral-400/70" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-2.5 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
                        {previewSidebarLabel}
                      </span>
                    </div>
                    {layoutMode === 'grid' ? (
                      <div className="grid grid-cols-2 gap-2">
                        {previewCards.map((cardClass, index) => (
                          <div key={index} className={`rounded-md border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800 ${cardClass}`}>
                            <div className="h-2 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                            <div className="mt-2 h-8 rounded-md bg-primary-100 dark:bg-primary-950/40" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {previewCards.map((cardClass, index) => (
                          <div key={index} className={`rounded-md border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-700 dark:bg-neutral-800 ${cardClass}`}>
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-950/40" />
                              <div className="flex-1">
                                <div className="h-2.5 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                                <div className="mt-1 h-2 w-1/2 rounded-full bg-neutral-100 dark:bg-neutral-700/80" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-primary-500 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              Done
            </button>
          </div>
        </div>
    </div>
  );
};

export default LayoutModal;
