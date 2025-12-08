import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

// Top Indian Writers with real Wikimedia Commons images (CC licensed)
const TOP_WRITERS = [
    {
        id: 1,
        name: "Chetan Bhagat",
        books: 12,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Chetan_Bhagat.jpg/220px-Chetan_Bhagat.jpg",
        genre: "Contemporary Fiction",
        color: "from-amber-400 to-orange-500"
    },
    {
        id: 2,
        name: "Arundhati Roy",
        books: 5,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Arundhati_Roy_W.jpg/220px-Arundhati_Roy_W.jpg",
        genre: "Literary Fiction",
        color: "from-purple-400 to-pink-500"
    },
    {
        id: 3,
        name: "Ruskin Bond",
        books: 50,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Ruskin_Bond_%28cropped%29.jpg/220px-Ruskin_Bond_%28cropped%29.jpg",
        genre: "Short Stories",
        color: "from-green-400 to-teal-500"
    },
    {
        id: 4,
        name: "Amish Tripathi",
        books: 8,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Amish_Tripathi_Author.JPG/220px-Amish_Tripathi_Author.JPG",
        genre: "Mythology Fiction",
        color: "from-blue-400 to-indigo-500"
    },
    {
        id: 5,
        name: "Sudha Murty",
        books: 30,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Sudha_Murthy_ji_in_2023.jpg/220px-Sudha_Murthy_ji_in_2023.jpg",
        genre: "Inspirational",
        color: "from-rose-400 to-red-500"
    },
    {
        id: 6,
        name: "R.K. Narayan",
        books: 35,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/R._K._Narayan.jpg/220px-R._K._Narayan.jpg",
        genre: "Classic Fiction",
        color: "from-cyan-400 to-blue-500"
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
};

export default function TopWriters() {
    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.span
                        className="inline-flex items-center gap-2 text-amber-600 font-medium text-sm uppercase tracking-wider mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <BookOpen className="w-4 h-4" />
                        Literary Legends
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-slate-800">
                        Top Writers
                    </h2>
                    <p className="text-slate-500 mt-3 max-w-md mx-auto">
                        Explore works from India's finest authors who have shaped the literary landscape
                    </p>
                </motion.div>

                {/* Writers Grid */}
                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {TOP_WRITERS.map((writer) => (
                        <motion.div
                            key={writer.id}
                            className="group text-center cursor-pointer"
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                        >
                            {/* Avatar with Ring Animation */}
                            <div className="relative w-28 h-28 mx-auto mb-5">
                                {/* Animated Ring */}
                                <motion.div
                                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${writer.color} opacity-0 group-hover:opacity-100 blur-md`}
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />

                                {/* Border Ring */}
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${writer.color} p-1`}>
                                    <div className="w-full h-full rounded-full bg-white p-1">
                                        <img
                                            src={writer.image}
                                            alt={writer.name}
                                            className="w-full h-full rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div
                                            className={`hidden w-full h-full rounded-full bg-gradient-to-br ${writer.color} items-center justify-center text-white text-2xl font-bold`}
                                        >
                                            {writer.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    </div>
                                </div>

                                {/* Books Badge */}
                                <motion.div
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    {writer.books}+ Books
                                </motion.div>
                            </div>

                            {/* Info */}
                            <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors text-lg">
                                {writer.name}
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">{writer.genre}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
