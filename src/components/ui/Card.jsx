import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`card p-6 ${hover ? 'hover:border-neutral-600 cursor-pointer transition-all duration-200' : ''} rounded-2xl border border-white/60 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/40 dark:shadow-[0_12px_30px_rgba(0,0,0,0.28)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
