import React from 'react';

const Textarea = React.forwardRef(({
  placeholder,
  className = '',
  error,
  rows = 4,
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        placeholder={placeholder}
        rows={rows}
        className={`input-base w-full resize-none ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
