import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './Button';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ShoppingBag, Eye } from 'lucide-react';

export default function BookCard({ book, index = 0 }) {
    const { addToCart } = useCart();
    const toast = useToast();

    // Staggered animation based on index
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    // 3D tilt effect
    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(book);
        if (toast) {
            toast.success(`"${book.title}" added to cart!`);
        }
    };

    return (
        <motion.div
            className="group relative bg-white text-slate-800 rounded-2xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl w-full max-w-[280px] transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Image Container */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <Link to={`/book/${book.id}`}>
                    <motion.img
                        src={book.cover}
                        alt={book.title}
                        className="object-cover w-full h-full"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                    />
                </Link>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Action Buttons */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <div className="flex gap-2">
                        <motion.button
                            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-medium transition-colors"
                            onClick={handleAddToCart}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Cart
                        </motion.button>
                        <Link to={`/book/${book.id}`}>
                            <motion.button
                                className="p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-xl transition-colors"
                                whileTap={{ scale: 0.95 }}
                            >
                                <Eye className="w-5 h-5" />
                            </motion.button>
                        </Link>
                    </div>
                </div>

                {/* Category Badge */}
                <motion.div
                    className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-slate-700 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {book.category}
                </motion.div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                <Link to={`/book/${book.id}`}>
                    <h3 className="font-heading font-bold text-lg leading-tight truncate hover:text-amber-600 transition-colors" title={book.title}>
                        {book.title}
                    </h3>
                </Link>
                <p className="text-slate-500 text-sm truncate">{book.author}</p>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-amber-600">₹{book.price}</span>
                        {book.originalPrice && (
                            <span className="text-xs text-slate-400 line-through">₹{book.originalPrice}</span>
                        )}
                    </div>

                    {/* Rating */}
                    {book.rating && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className="text-sm font-medium text-slate-700">{book.rating}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
