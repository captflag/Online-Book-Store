import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../lib/books';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Share2, ArrowLeft, Star, BookOpen, Truck } from 'lucide-react';

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();
    const toast = useToast();

    useEffect(() => {
        async function fetchBook() {
            try {
                const data = await getBookById(id);
                setBook(data);
            } catch (error) {
                console.error("Failed to fetch book", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBook();
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(book);
        }
        if (toast) {
            toast.success(`Added ${quantity} × "${book.title}" to cart!`);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 min-h-screen bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
                    <div className="aspect-[2/3] bg-slate-200 rounded-2xl"></div>
                    <div className="space-y-6">
                        <div className="h-10 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-20 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Book not found</h2>
                    <Link to="/shop">
                        <Button>Back to Shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link to="/shop" className="inline-flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Shop
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="sticky top-28">
                            {/* Main Image */}
                            <motion.div
                                className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </motion.div>

                            {/* Floating Actions */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <motion.button
                                    className={`p-3 rounded-full backdrop-blur-sm shadow-lg transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-slate-700 hover:bg-red-50 hover:text-red-500'
                                        }`}
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </motion.button>
                                <motion.button
                                    className="p-3 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-slate-100 shadow-lg transition-colors"
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Share2 className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Category Badge */}
                        <motion.span
                            className="inline-block bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-sm font-medium"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {book.category}
                        </motion.span>

                        {/* Title & Author */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-slate-800 leading-tight">
                                {book.title}
                            </h1>
                            <p className="text-xl text-slate-500 mt-3">by <span className="text-slate-700 font-medium">{book.author}</span></p>
                        </div>

                        {/* Rating */}
                        {book.rating && (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(book.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-lg font-medium text-slate-700">{book.rating}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">128 Reviews</span>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-bold text-amber-600">₹{book.price}</span>
                            {book.originalPrice && (
                                <span className="text-xl text-slate-400 line-through">₹{book.originalPrice}</span>
                            )}
                            {book.originalPrice && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                    {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 text-lg leading-relaxed">
                            {book.description}
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <BookOpen className="w-6 h-6 text-amber-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Format</p>
                                    <p className="font-medium text-slate-700">Paperback</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                                <Truck className="w-6 h-6 text-amber-500" />
                                <div>
                                    <p className="text-sm text-slate-500">Delivery</p>
                                    <p className="font-medium text-slate-700">Free Shipping</p>
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                                <button
                                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    -
                                </button>
                                <span className="px-6 py-3 font-medium text-slate-800 min-w-[60px] text-center">
                                    {quantity}
                                </span>
                                <button
                                    className="px-4 py-3 text-slate-600 hover:bg-slate-100 transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                size="lg"
                                className="flex-1 gap-2"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Add to Cart
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                100% Original
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                Secure Payment
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
