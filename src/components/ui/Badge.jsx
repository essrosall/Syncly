import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-neutral-700 text-neutral-100',
    primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/30',
    success: 'bg-success-500/20 text-success-400 border border-success-500/30',
    warning: 'bg-warning-500/20 text-warning-400 border border-warning-500/30',
    error: 'bg-error-500/20 text-error-400 border border-error-500/30',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
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
