import React from 'react';

const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = 'btn-base inline-flex items-center justify-center gap-2 font-medium';

  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-neutral-700 hover:bg-neutral-600 text-neutral-100',
    ghost: 'bg-transparent hover:bg-neutral-800 text-neutral-300 border border-neutral-700',
    danger: 'bg-error-500 hover:bg-error-600 text-white',
    success: 'bg-success-500 hover:bg-success-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const lightModeVariants = {
    primary: 'dark:bg-primary-500 dark:hover:bg-primary-600 dark:text-white bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-neutral-100 bg-neutral-200 hover:bg-neutral-300 text-neutral-900',
    ghost: 'dark:bg-transparent dark:hover:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 text-neutral-700 border border-neutral-300',
    danger: 'dark:bg-error-500 dark:hover:bg-error-600 dark:text-white bg-error-600 hover:bg-error-700 text-white',
    success: 'dark:bg-success-500 dark:hover:bg-success-600 dark:text-white bg-success-600 hover:bg-success-700 text-white',
  };

  return (
    <button
      ref={ref}
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
