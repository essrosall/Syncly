import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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
    <div className="w-full">
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
          className={`input-base w-full ${Icon ? 'pl-10' : ''} ${isPasswordField ? 'pr-11' : ''} ${error ? 'border-error-500 focus:ring-error-500' : ''} ${className}`}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            disabled={props.disabled}
            tabIndex={-1}
            aria-disabled={props.disabled}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors ${props.disabled ? 'cursor-not-allowed text-neutral-300' : 'hover:bg-neutral-50 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'}`}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
