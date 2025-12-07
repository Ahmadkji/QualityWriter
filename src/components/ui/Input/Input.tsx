'use client';

import React, { forwardRef, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  animated?: boolean;
  gradient?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    success = false,
    animated = true,
    gradient = false,
    leftIcon,
    rightIcon,
    helperText,
    showPasswordToggle = false,
    type = 'text',
    ...props
  }, ref) => {
    const [focused, setFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const actualType = showPasswordToggle && type === 'password' 
      ? showPassword ? 'text' : 'password' 
      : type;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const baseClasses = 'w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-300 outline-none';
    
    const stateClasses = clsx(
      'bg-white',
      error && 'border-red-500 text-red-900 animate-shake',
      success && 'border-green-500 text-green-900',
      !error && !success && focused && 'border-purple-500 shadow-lg shadow-purple-500/20',
      !error && !success && !focused && 'border-gray-300 text-gray-900'
    );
    
    const animatedClasses = animated ? 'transform hover:scale-[1.01] focus:scale-[1.02]' : '';
    const gradientClasses = gradient ? 'bg-gradient-to-r from-purple-50 to-pink-50' : '';
    
    const inputClasses = clsx(
      baseClasses,
      stateClasses,
      animatedClasses,
      gradientClasses,
      leftIcon && 'pl-12',
      (rightIcon || showPasswordToggle) && 'pr-12',
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className={clsx(
            'text-sm font-medium transition-colors duration-200',
            error ? 'text-red-700' : success ? 'text-green-700' : focused ? 'text-purple-700' : 'text-gray-700'
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={actualType}
            className={inputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...props}
          />
          
          {/* Right icon or password toggle */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {success && !error && hasValue && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            
            {error && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            
            {showPasswordToggle && type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            
            {rightIcon && !success && !error && (
              <div className="text-gray-400 transition-colors duration-200">
                {rightIcon}
              </div>
            )}
          </div>
          
          {/* Focus ring */}
          {focused && (
            <div className="absolute inset-0 rounded-lg border-2 border-purple-500/20 pointer-events-none" />
          )}
        </div>
        
        {/* Helper text */}
        {helperText && (
          <p className={clsx(
            'text-xs transition-colors duration-200',
            error ? 'text-red-600' : success ? 'text-green-600' : 'text-gray-500'
          )}>
            {helperText}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p className="text-xs text-red-600 animate-slide-up flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;