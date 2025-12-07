'use client';

import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'interactive' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  animated?: boolean;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    hover = false, 
    animated = false, 
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'transition-all duration-300 relative overflow-hidden';
    
    const variantClasses = {
      default: 'bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg',
      gradient: 'bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg shadow-purple-500/20',
      interactive: 'bg-white border border-gray-200/50 shadow-md hover:shadow-xl',
      glass: 'bg-white/20 backdrop-blur-xl border border-white/20 shadow-lg'
    };
    
    const sizeClasses = {
      sm: 'p-4 rounded-xl',
      md: 'p-6 rounded-2xl',
      lg: 'p-8 rounded-3xl'
    };
    
    const hoverClasses = hover ? 'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 cursor-pointer' : '';
    const animatedClasses = animated ? 'animate-slide-up' : '';
    
    return (
      <div
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          hoverClasses,
          animatedClasses,
          className
        )}
        {...props}
      >
        {/* Gradient overlay for interactive cards */}
        {variant === 'interactive' && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}
        
        {/* Top accent line for gradient cards */}
        {variant === 'gradient' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-2xl" />
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;