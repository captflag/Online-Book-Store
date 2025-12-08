import React, { useEffect, useState } from 'react';
import { getBooks } from '../lib/books';
import BookCard from '../components/ui/BookCard';
import Filters from '../components/shop/Filters';
import { Button } from '../components/ui/Button';
import { Filter as FilterIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Shop() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const data = await getBooks();
                setBooks(data);
            } catch (error) {
                console.error("Failed to fetch books", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    const categories = ['All', ...new Set(books.map(b => b.category))];

    const filteredBooks = selectedCategory === 'All'
        ? books
        : books.filter(b => b.category === selectedCategory);

    return (
        <div className="container mx-auto px-4 py-8 bg-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-heading font-bold text-slate-800">Shop</h1>
                <Button
                    variant="outline"
                    className="md:hidden flex items-center gap-2 border-slate-300 text-slate-700"
                    onClick={() => setIsMobileFiltersOpen(true)}
                >
                    <FilterIcon className="w-4 h-4" /> Filters
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 flex-shrink-0 sticky top-24 h-fit">
                    <Filters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </aside>

                {/* Mobile Filters Drawer */}
                <AnimatePresence>
                    {isMobileFiltersOpen && (
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            className="fixed inset-0 z-50 bg-white p-6 md:hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold font-heading text-slate-800">Filters</h2>
                                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-slate-700">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <Filters
                                categories={categories}
                                selectedCategory={selectedCategory}
                                onCategoryChange={(cat) => {
                                    setSelectedCategory(cat);
                                    setIsMobileFiltersOpen(false);
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Book Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="w-full max-w-[280px] h-[400px] bg-slate-100 animate-pulse rounded-xl"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
                            {filteredBooks.map(book => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredBooks.length === 0 && (
                        <div className="text-center py-20 text-slate-500">
                            No books found in this category.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
