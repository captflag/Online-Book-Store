import React from 'react';
import { Button } from '../ui/Button';

export default function Filters({ selectedCategory, onCategoryChange, categories }) {
    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-bold font-heading mb-4 text-slate-800">Categories</h3>
                <ul className="space-y-2">
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <li key={category}>
                                <button
                                    onClick={() => onCategoryChange(category)}
                                    className={`text-sm hover:text-amber-600 transition-colors ${selectedCategory === category
                                        ? 'text-amber-600 font-bold'
                                        : 'text-slate-600'
                                        }`}
                                >
                                    {category}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="text-slate-400 text-sm">Loading...</li>
                    )}
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-bold font-heading mb-4 text-slate-800">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="range"
                        min="0"
                        max="500"
                        className="w-full accent-amber-500"
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>₹0</span>
                    <span>₹500+</span>
                </div>
            </div>

            <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100" onClick={() => onCategoryChange('All')}>
                Reset Filters
            </Button>
        </div>
    );
}
