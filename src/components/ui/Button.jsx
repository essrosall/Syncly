import React from 'react';

const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'btn-base inline-flex items-center justify-center gap-2 font-medium';

  const variants = {
    primary: 'bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 shadow-sm dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-100 dark:border-neutral-700',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 dark:border-neutral-700',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 border border-transparent dark:text-neutral-200 dark:hover:bg-neutral-800',
    danger: 'bg-error-500 hover:bg-error-600 text-white',
    success: 'bg-success-500 hover:bg-success-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
