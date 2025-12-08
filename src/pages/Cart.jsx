import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center bg-white">
                <ShoppingBag className="w-20 h-20 text-slate-300 mb-6" />
                <h2 className="text-3xl font-heading font-bold mb-4 text-slate-800">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't discovered your next favorite book yet. Explore our collection and add some books to your cart!</p>
                <Link to="/shop">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
            <h1 className="text-4xl font-heading font-bold mb-8 text-slate-800">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence>
                        {cart.map((item) => (
                            <motion.div
                                key={item.id}
                                className="flex gap-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                layout
                            >
                                <div className="w-24 h-36 flex-shrink-0 bg-slate-100 rounded overflow-hidden">
                                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-heading font-bold text-lg text-slate-800">{item.title}</h3>
                                        <p className="text-sm text-slate-500">{item.author}</p>
                                        <p className="text-amber-600 font-bold mt-1">₹{item.price.toFixed(0)}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-slate-100 rounded-md p-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:text-amber-600 transition-colors text-slate-700"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm font-medium w-4 text-center text-slate-800">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:text-amber-600 transition-colors text-slate-700"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                            title="Remove from cart"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-lg sticky top-24">
                        <h2 className="text-xl font-bold font-heading mb-6 text-slate-800">Order Summary</h2>

                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>₹{cartTotal.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <div className="border-t border-slate-200 pt-4 flex justify-between font-bold text-lg text-slate-800">
                                <span>Total</span>
                                <span className="text-amber-600">₹{cartTotal.toFixed(0)}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="block w-full">
                            <Button className="w-full gap-2" variant="primary" size="lg">
                                Proceed to Checkout <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>

                        <p className="text-xs text-center text-slate-500 mt-4">
                            Secure checkout tailored for you.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
