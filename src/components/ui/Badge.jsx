const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
    primary: 'bg-primary-50 text-primary-700 border border-primary-100',
    success: 'bg-success-500/12 text-success-600 border border-success-500/20',
    warning: 'bg-warning-500/12 text-warning-600 border border-warning-500/20',
    error: 'bg-error-500/12 text-error-600 border border-error-500/20',
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
