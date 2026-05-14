import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '../ui';
import { filterSuggestions } from '../../lib/profileSuggestions';

const SearchableTagField = ({
  label,
  helperText,
  placeholder,
  suggestions,
  values,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const suggestionsToShow = filterSuggestions(inputValue, suggestions, values).slice(0, 6);

  const addValue = (rawValue) => {
    const nextValue = rawValue.trim();
    if (!nextValue || values.includes(nextValue)) return;

    onChange([...values, nextValue]);
    setInputValue('');
    setIsOpen(false);
  };

  const removeValue = (valueToRemove) => {
    onChange(values.filter((value) => value !== valueToRemove));
  };

  const clearAll = () => {
    onChange([]);
    setInputValue('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
        {helperText ? (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
        ) : null}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addValue(inputValue);
              }
            }}
          />

          {isOpen && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-neutral-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-800">
              {suggestionsToShow.length > 0 ? (
                suggestionsToShow.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addValue(suggestion)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  >
                    <span>{suggestion}</span>
                    <Plus size={14} className="text-neutral-400" />
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  onClick={() => addValue(inputValue)}
                  className="w-full px-3 py-2 text-left text-sm text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                >
                  Add "{inputValue}" as a custom option
                </button>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => addValue(inputValue)}
          className="inline-flex items-center justify-center rounded-md bg-neutral-100 px-3 py-2 text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
          aria-label={`Add ${label}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {values.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{values.length} selected</span>
            <button
              type="button"
              onClick={clearAll}
              className="font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <div key={value} className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm dark:bg-neutral-700">
              <span className="text-neutral-700 dark:text-neutral-200">{value}</span>
              <button
                type="button"
                onClick={() => removeValue(value)}
                className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                aria-label={`Remove ${value}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Search to add items. Selected values will appear here and can be removed.</p>
      )}
    </div>
  );
};

export default SearchableTagField;
