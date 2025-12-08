import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold font-heading text-slate-800 tracking-wider">
                        Capt<span className="text-amber-600">Books</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-amber-600 transition-colors">Home</Link>
                        <Link to="/shop" className="text-slate-600 hover:text-amber-600 transition-colors">Shop</Link>
                        <Link to="/categories" className="text-slate-600 hover:text-amber-600 transition-colors">Categories</Link>
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center space-x-6">
                        <button className="text-slate-600 hover:text-amber-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        <Link to="/cart" className="relative text-slate-600 hover:text-amber-600 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {currentUser ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="text-slate-600 hover:text-amber-600">
                                    <User className="w-5 h-5" />
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                                <Link to="/signup"><Button variant="primary" size="sm">Sign Up</Button></Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-800">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-200"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <Link to="/" className="block py-2 text-slate-700 hover:text-amber-600">Home</Link>
                            <Link to="/shop" className="block py-2 text-slate-700 hover:text-amber-600">Shop</Link>
                            <Link to="/categories" className="block py-2 text-slate-700 hover:text-amber-600">Categories</Link>
                            <hr className="border-slate-200 my-2" />
                            <Link to="/cart" className="block py-2 text-slate-700 hover:text-amber-600 flex items-center justify-between">
                                Cart <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-1">{cartCount}</span>
                            </Link>
                            {currentUser ? (
                                <>
                                    <Link to="/profile" className="block py-2 text-slate-700 hover:text-amber-600">Profile</Link>
                                    <button onClick={handleLogout} className="block w-full text-left py-2 text-slate-700 hover:text-amber-600">Logout</button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <Link to="/login"><Button variant="ghost" className="w-full">Login</Button></Link>
                                    <Link to="/signup"><Button variant="primary" className="w-full">Sign Up</Button></Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
