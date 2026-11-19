import React from 'react';

/**
 * Reusable Card component for MediConnect
 * Supports interactive hover effects, clean borders, and padding
 */
export function Card({
  children,
  className = '',
  interactive = false,
  onClick,
  ...props
}) {
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-primary transition-all duration-200'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-xs ${interactiveStyles} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`mb-4 ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-main tracking-tight ${className}`.trim()}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-secondary leading-relaxed ${className}`.trim()}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return <div className={`flex-1 ${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`mt-4 pt-3 border-t border-slate-100 ${className}`.trim()}>{children}</div>;
}

export default Card;
