import type { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
}

const variantStyles = {
  default: 'bg-white',
  outlined: 'bg-white border-2 border-gray-200',
  elevated: 'bg-white shadow-lg',
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  ...props
}: CardProps) => {
  const baseStyles = 'rounded-lg transition-all';
  const hoverStyles = hover || clickable ? 'hover:shadow-md cursor-pointer' : '';
  const clickableStyles = clickable ? 'focus:outline-none focus:ring-2 focus:ring-primary-500' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${clickableStyles} ${className}`}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      {...props}
    >
      {children}
    </div>
  );
};
