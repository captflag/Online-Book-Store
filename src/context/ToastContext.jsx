import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

const toastIcons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
};

const toastStyles = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    info: 'border-l-4 border-blue-500',
};

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (message) => addToast(message, 'success'),
        error: (message) => addToast(message, 'error'),
        info: (message) => addToast(message, 'info'),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            className={`bg-white shadow-2xl rounded-xl p-4 min-w-[300px] flex items-center gap-3 ${toastStyles[t.type]}`}
                        >
                            {toastIcons[t.type]}
                            <span className="flex-1 text-slate-700 font-medium">{t.message}</span>
                            <button
                                onClick={() => removeToast(t.id)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
