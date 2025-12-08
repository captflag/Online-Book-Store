import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25",
    secondary: "bg-slate-800 text-white hover:bg-slate-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
    outline: "border-2 border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-300",
    danger: "bg-red-500 text-white hover:bg-red-600",
};

const sizes = {
    sm: "h-9 px-4 text-sm rounded-lg",
    md: "h-11 px-6 text-base rounded-xl",
    lg: "h-14 px-8 text-lg rounded-xl font-semibold",
};

export const Button = React.forwardRef(({
    className,
    variant = "primary",
    size = "md",
    children,
    disabled,
    ...props
}, ref) => {
    return (
        <motion.button
            ref={ref}
            className={cn(
                "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
                variants[variant],
                sizes[size],
                className
            )}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            disabled={disabled}
            {...props}
        >
            {/* Ripple Effect Background */}
            <span className="absolute inset-0 overflow-hidden rounded-xl">
                <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </span>

            {/* Content */}
            <span className="relative flex items-center gap-2">
                {children}
            </span>
        </motion.button>
    );
});

Button.displayName = "Button";
