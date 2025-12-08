import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === book.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === book.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...book, quantity: 1 }];
        });

        // Return true to indicate success (for toast)
        return true;
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
