import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`card p-6 ${hover ? 'hover:border-neutral-600 cursor-pointer transition-all duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
