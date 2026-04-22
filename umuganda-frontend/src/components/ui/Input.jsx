import React, { forwardRef } from 'react';


const Input = forwardRef(({
    label,
    type = 'text',
    error,
    className,
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={`
            w-full bg-white dark:bg-gray-800 border rounded-lg px-4 py-3 outline-none transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200 focus:border-red-500'
                            : 'border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-sky-100 focus:border-rwanda-blue dark:focus:border-rwanda-blue'
                        }
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-gray-400 dark:text-white
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-500 animate-fadeIn pl-1">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
