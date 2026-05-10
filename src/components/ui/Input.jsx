import React from 'react';

const Input = React.forwardRef(({
  type = 'text',
  placeholder,
  className = '',
  error,
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon size={20} />
        </div>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`input-base w-full ${Icon ? 'pl-10' : ''} ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
