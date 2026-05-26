const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-success-50 text-success-800 border border-success-200 dark:bg-success-950/35 dark:text-success-100 dark:border-success-800',
    primary: 'bg-info-50 text-info-800 border border-info-200 dark:bg-info-950/35 dark:text-info-100 dark:border-info-800',
    success: 'bg-success-50 text-success-800 border border-success-200 dark:bg-success-950/35 dark:text-success-100 dark:border-success-800',
    warning: 'bg-warning-50 text-warning-800 border border-warning-200 dark:bg-warning-950/35 dark:text-warning-100 dark:border-warning-800',
    error: 'bg-error-50 text-error-800 border border-error-200 dark:bg-error-950/35 dark:text-error-100 dark:border-error-800',
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
