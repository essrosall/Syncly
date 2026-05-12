import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`inline-block ${sizes[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-full border-2 border-neutral-300 dark:border-neutral-700"></div>
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-neutral-500 border-r-neutral-500 animate-spin dark:border-t-primary-500 dark:border-r-primary-500"
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
