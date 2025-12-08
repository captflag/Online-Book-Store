import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-heading text-white">
                            Capt<span className="text-amber-500">Books</span>
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Curating India's finest stories for the discerning reader. Experience literature in a new light.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
                            <li><Link to="/shop" className="hover:text-amber-400 transition-colors">Shop</Link></li>
                            <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Categories</Link></li>
                            <li><Link to="/authors" className="hover:text-amber-400 transition-colors">Authors</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-amber-400 transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Stay Updated</h4>
                        <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for exclusive releases.</p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-sm w-full focus:outline-none focus:border-amber-500 transition-colors"
                                aria-label="Email for newsletter"
                            />
                            <button
                                className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors"
                                aria-label="Subscribe"
                            >
                                Go
                            </button>
                        </div>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-slate-700 text-center text-xs text-slate-500">
                    &copy; {new Date().getFullYear()} CaptBooks. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
