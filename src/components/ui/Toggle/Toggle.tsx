'use client';

import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  description?: string;
  className?: string;
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({
    checked = false,
    onChange,
    label,
    disabled = false,
    size = 'md',
    animated = true,
    description,
    className,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked);
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleChange = () => {
      const newChecked = !isChecked;
      setIsChecked(newChecked);
      onChange?.(newChecked);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    const sizeClasses = {
      sm: 'w-8 h-4',
      md: 'w-12 h-6',
      lg: 'w-16 h-8'
    };

    const thumbSizeClasses = {
      sm: 'w-3 h-3 top-0.5 left-0.5',
      md: 'w-5 h-5 top-0.5 left-0.5',
      lg: 'w-7 h-7 top-0.5 left-0.5'
    };

    const thumbActiveClasses = {
      sm: 'left-4.5',
      md: 'left-7',
      lg: 'left-9'
    };

    const baseClasses = 'relative inline-flex items-center cursor-pointer transition-all duration-300';
    const toggleClasses = clsx(
      'rounded-full transition-all duration-300 outline-none',
      sizeClasses[size],
      isChecked 
        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30' 
        : 'bg-gray-300',
      disabled && 'opacity-50 cursor-not-allowed',
      !disabled && animated && 'hover:scale-105',
      isFocused && !disabled && 'ring-2 ring-purple-500 ring-offset-2'
    );

    const thumbClasses = clsx(
      'absolute bg-white rounded-full shadow-md transition-all duration-300',
      thumbSizeClasses[size],
      isChecked 
        ? thumbActiveClasses[size]
        : '',
      !disabled && animated && 'hover:scale-110',
      isChecked && 'shadow-lg shadow-purple-500/40'
    );

    return (
      <div className={clsx('space-y-2', className)}>
        {label && (
          <label className={clsx(
            'text-sm font-medium transition-colors duration-200',
            disabled ? 'text-gray-400 cursor-not-allowed' : 
            isChecked ? 'text-purple-700' : 'text-gray-700'
          )}>
            {label}
          </label>
        )}
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={isChecked}
            disabled={disabled}
            className={baseClasses}
            onClick={() => !disabled && onChange?.(!isChecked)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <div className={toggleClasses}>
              <div className={thumbClasses} />
              
              {/* Animated glow effect when active */}
              {isChecked && !disabled && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 animate-pulse" />
              )}
            </div>
          </button>
          
          {/* Hidden checkbox for form submission */}
          <input
            ref={ref}
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
          />
        </div>
        
        {description && (
          <p className={clsx(
            'text-xs transition-colors duration-200',
            disabled ? 'text-gray-400' : 'text-gray-500'
          )}>
            {description}
          </p>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export default Toggle;