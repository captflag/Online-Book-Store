import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccess() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <CheckCircle className="w-24 h-24 text-green-500 mb-8" />
            </motion.div>

            <motion.h1
                className="text-4xl md:text-5xl font-heading font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Order Confirmed!
            </motion.h1>

            <motion.p
                className="text-lg text-muted-foreground mb-8 max-w-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                Thank you for your purchase. Your books will be on their way shortly.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <Link to="/">
                    <Button size="lg" className="shadow-lg">Continue Shopping</Button>
                </Link>
            </motion.div>
        </div>
    );
}
