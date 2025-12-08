import React from 'react';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3
        }
    }
};

export default function Layout({ children }) {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="pt-20 flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        variants={pageVariants}
                        initial="initial"
                        animate="enter"
                        exit="exit"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
}
