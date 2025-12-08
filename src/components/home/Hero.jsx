import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, Sparkles, Star } from 'lucide-react';

// Floating Book Component
const FloatingBook = ({ delay, className, children }) => (
    <motion.div
        className={`absolute ${className}`}
        animate={{
            y: [0, -20, 0],
            rotate: [-2, 2, -2],
        }}
        transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
    >
        {children}
    </motion.div>
);

// Animated Sparkle
const AnimatedSparkle = ({ className, delay }) => (
    <motion.div
        className={`absolute ${className}`}
        animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
        }}
        transition={{
            duration: 2,
            delay,
            repeat: Infinity,
        }}
    >
        <Sparkles className="w-6 h-6 text-amber-400" />
    </motion.div>
);

export default function Hero() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 150]);
    const y2 = useTransform(scrollY, [0, 500], [0, -100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section className="relative w-full min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Animated Background Elements */}
            <motion.div
                className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-200/40 to-orange-200/40 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-tr from-orange-200/30 to-amber-100/30 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Floating Decorative Books */}
            <FloatingBook delay={0} className="top-32 left-[15%] opacity-60">
                <div className="w-16 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-md shadow-xl transform rotate-12" />
            </FloatingBook>
            <FloatingBook delay={1} className="top-48 right-[20%] opacity-50">
                <div className="w-14 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-md shadow-xl transform -rotate-6" />
            </FloatingBook>
            <FloatingBook delay={2} className="bottom-32 left-[25%] opacity-40">
                <div className="w-12 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-md shadow-xl transform rotate-3" />
            </FloatingBook>
            <FloatingBook delay={1.5} className="bottom-48 right-[15%] opacity-50">
                <div className="w-14 h-20 bg-gradient-to-br from-rose-400 to-red-500 rounded-md shadow-xl transform -rotate-12" />
            </FloatingBook>

            {/* Animated Sparkles */}
            <AnimatedSparkle className="top-40 left-[30%]" delay={0} />
            <AnimatedSparkle className="top-60 right-[35%]" delay={0.5} />
            <AnimatedSparkle className="bottom-40 left-[40%]" delay={1} />
            <AnimatedSparkle className="bottom-32 right-[25%]" delay={1.5} />

            {/* Main Content with Parallax */}
            <motion.div
                style={{ y: y1, opacity }}
                className="relative z-10 container mx-auto px-4 text-center space-y-8"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    India's Premium Book Store
                </motion.div>

                <motion.h1
                    className="font-heading text-5xl md:text-7xl font-bold text-slate-800 leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Stories that <br />
                    <motion.span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"
                        animate={{
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        style={{ backgroundSize: '200% 200%' }}
                    >
                        Ignite the Soul
                    </motion.span>
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Discover India's finest literary treasures, from timeless classics to contemporary bestsellers.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    <Link to="/shop">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-amber-500/30 gap-2">
                                <BookOpen className="w-5 h-5" />
                                Start Reading
                            </Button>
                        </motion.div>
                    </Link>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button variant="outline" size="lg" className="rounded-full px-8 border-slate-300 text-slate-700 hover:bg-slate-100">
                            Explore Authors
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="flex justify-center gap-12 pt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    {[
                        { value: '10K+', label: 'Books' },
                        { value: '500+', label: 'Authors' },
                        { value: '50K+', label: 'Readers' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2 + i * 0.1 }}
                        >
                            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
