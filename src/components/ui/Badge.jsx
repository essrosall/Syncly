const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700',
    primary: 'bg-primary-50 text-primary-700 border border-primary-100 dark:bg-primary-500/15 dark:text-primary-200 dark:border-primary-500/25',
    success: 'bg-success-500/12 text-success-600 border border-success-500/20 dark:bg-success-500/20 dark:text-success-500 dark:border-success-500/25',
    warning: 'bg-warning-500/12 text-warning-600 border border-warning-500/20 dark:bg-warning-500/20 dark:text-warning-500 dark:border-warning-500/25',
    error: 'bg-error-500/12 text-error-600 border border-error-500/20 dark:bg-error-500/20 dark:text-error-500 dark:border-error-500/25',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
