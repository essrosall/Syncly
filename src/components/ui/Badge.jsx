const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-success-500 text-white dark:bg-success-600',
    primary: 'bg-white text-neutral-700 border border-neutral-200 dark:bg-primary-500/15 dark:text-primary-200 dark:border-primary-500/25',
    success: 'bg-success-500 text-white dark:bg-success-600',
    warning: 'bg-warning-500 text-white dark:bg-warning-600',
    error: 'bg-error-500 text-white dark:bg-error-600',
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
