import React, { useState } from 'react';

const Input = React.forwardRef(({
  type = 'text',
  placeholder,
  className = '',
  error,
  icon: Icon,
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPasswordField = type === 'password' && showPasswordToggle;
  const resolvedType = isPasswordField && isPasswordVisible ? 'text' : type;

  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <Icon size={20} />
        </div>
      )}
      <input
        ref={ref}
        type={resolvedType}
        placeholder={placeholder}
        className={`input-base w-full ${Icon ? 'pl-10' : ''} ${isPasswordField ? 'pr-24' : ''} ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
        {...props}
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible((visible) => !visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-200"
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? 'Hide' : 'Show'}
        </button>
      )}
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
