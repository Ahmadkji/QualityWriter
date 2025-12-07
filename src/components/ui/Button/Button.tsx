'use client';

import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loadingText?: string;
  animated?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    loadingText,
    animated = true,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-300 relative overflow-hidden inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
      ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
      danger: 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg hover:shadow-red-500/30 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
      success: 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg hover:shadow-green-500/30 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed'
    };
    
    const sizeClasses = {
      xs: 'px-2 py-1 text-xs h-6',
      sm: 'px-3 py-1.5 text-sm h-8',
      md: 'px-4 py-2 text-base h-10',
      lg: 'px-6 py-3 text-lg h-12',
      xl: 'px-8 py-4 text-xl h-14'
    };
    
    const widthClasses = fullWidth ? 'w-full' : '';
    const stateClasses = (loading || disabled) ? 'cursor-not-allowed' : 'hover:transform hover:-translate-y-0.5 active:translate-y-0';
    
    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          widthClasses,
          stateClasses,
          animated && 'hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {/* Shimmer effect for primary buttons */}
        {variant === 'primary' && !loading && !disabled && (
          <div className="absolute inset-0 -top-2 h-8 w-8 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-y-full skew-x-12 animate-shimmer" />
        )}
        
        {/* Loading spinner */}
        {loading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        
        {/* Left icon */}
        {!loading && leftIcon && (
          <span className="flex-shrink-0">{leftIcon}</span>
        )}
        
        {/* Button text */}
        <span className={loading ? 'opacity-0' : ''}>
          {loading ? loadingText || 'Loading...' : children}
        </span>
        
        {/* Right icon */}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;