import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedBooks from '../components/home/FeaturedBooks';
import TopWriters from '../components/home/TopWriters';

export default function Home() {
    return (
        <div className="min-h-screen">
            <Hero />
            <FeaturedBooks />
            <TopWriters />
        </div>
    );
}
