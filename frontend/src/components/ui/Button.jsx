import React from 'react';

/**
 * Reusable Button component for MediConnect
 * Supports variants (primary, secondary, outline, ghost) and sizes (sm, md, lg)
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow-md focus-visible:ring-primary',
    secondary: 'bg-white text-teal border border-teal hover:bg-teal/10 hover:border-teal-hover focus-visible:ring-teal',
    outline: 'bg-transparent text-primary border border-primary hover:bg-primary hover:text-white focus-visible:ring-primary',
    ghost: 'bg-transparent text-secondary hover:text-main hover:bg-slate-100 focus-visible:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
