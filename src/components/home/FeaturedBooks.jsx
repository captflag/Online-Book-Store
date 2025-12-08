import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from '../ui/BookCard';

// Indian Market Featured Books
const FEATURED_BOOKS = [
    {
        id: "1",
        title: "The Palace of Illusions",
        author: "Chitra Banerjee Divakaruni",
        price: 399,
        originalPrice: 499,
        rating: 4.8,
        category: "Fiction",
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "2",
        title: "The God of Small Things",
        author: "Arundhati Roy",
        price: 350,
        originalPrice: 425,
        rating: 4.7,
        category: "Fiction",
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "3",
        title: "Ikigai",
        author: "Héctor García",
        price: 299,
        rating: 4.9,
        category: "Self-Help",
        cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "4",
        title: "Wings of Fire",
        author: "Dr. A.P.J. Abdul Kalam",
        price: 199,
        rating: 4.9,
        category: "Biography",
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "5",
        title: "The White Tiger",
        author: "Aravind Adiga",
        price: 450,
        rating: 4.5,
        category: "Fiction",
        cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: "6",
        title: "Atomic Habits",
        author: "James Clear",
        price: 499,
        originalPrice: 599,
        rating: 4.8,
        category: "Self-Help",
        cover: "https://images.unsplash.com/photo-1626618012641-bfbca5a31238?auto=format&fit=crop&q=80&w=800"
    }
];

export default function FeaturedBooks() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        const ref = scrollRef.current;
        if (ref) {
            ref.addEventListener('scroll', checkScrollPosition);
            checkScrollPosition();
            return () => ref.removeEventListener('scroll', checkScrollPosition);
        }
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    className="flex justify-between items-end mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div>
                        <motion.span
                            className="text-amber-600 font-medium text-sm uppercase tracking-wider"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Handpicked for you
                        </motion.span>
                        <h2 className="text-4xl font-bold font-heading text-slate-800 mt-2">
                            Featured Collection
                        </h2>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="hidden sm:flex gap-2">
                        <motion.button
                            className={`p-3 rounded-full border transition-all duration-300 ${canScrollLeft
                                    ? 'border-slate-300 text-slate-700 hover:bg-amber-500 hover:text-white hover:border-amber-500'
                                    : 'border-slate-200 text-slate-300 cursor-not-allowed'
                                }`}
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            whileTap={canScrollLeft ? { scale: 0.9 } : {}}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            className={`p-3 rounded-full border transition-all duration-300 ${canScrollRight
                                    ? 'border-slate-300 text-slate-700 hover:bg-amber-500 hover:text-white hover:border-amber-500'
                                    : 'border-slate-200 text-slate-300 cursor-not-allowed'
                                }`}
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            whileTap={canScrollRight ? { scale: 0.9 } : {}}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>

                {/* Scrollable Carousel */}
                <div className="relative">
                    {/* Gradient Fade Left */}
                    <div className={`absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

                    {/* Gradient Fade Right */}
                    <div className={`absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {FEATURED_BOOKS.map((book, index) => (
                            <div key={book.id} className="flex-shrink-0">
                                <BookCard book={book} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
