import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../lib/orders';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Shield, ArrowLeft, Check } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const { currentUser } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: currentUser?.displayName || '',
        email: currentUser?.email || '',
        address: '',
        city: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const shipping = cartTotal > 500 ? 0 : 50;
    const total = cartTotal + shipping;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step === 1) {
            setStep(2);
            return;
        }

        setLoading(true);

        try {
            // Create order in Firestore
            const order = await createOrder({
                items: cart,
                customer: {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    zip: formData.zip
                },
                payment: {
                    cardNumber: formData.cardNumber
                },
                subtotal: cartTotal,
                shipping: shipping,
                total: total
            });

            // Clear cart and show success
            clearCart();
            toast?.success('Order placed successfully!');
            navigate('/order-success', { state: { orderId: order.id } });

        } catch (error) {
            console.error('Order failed:', error);
            toast?.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-12">
            <div className="container mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-amber-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    {step === 1 ? 'Back to Cart' : 'Back to Shipping'}
                </button>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[1, 2].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`flex items-center gap-2 ${s <= step ? 'text-amber-600' : 'text-slate-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s < step ? 'bg-green-500 text-white' :
                                        s === step ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'
                                    }`}>
                                    {s < step ? <Check className="w-4 h-4" /> : s}
                                </div>
                                <span className="font-medium hidden sm:block">
                                    {s === 1 ? 'Shipping' : 'Payment'}
                                </span>
                            </div>
                            {s < 2 && <div className={`w-12 h-0.5 ${s < step ? 'bg-green-500' : 'bg-slate-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
                            {step === 1 ? (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <Truck className="w-6 h-6 text-amber-500" />
                                        <h2 className="text-2xl font-bold text-slate-800">Shipping Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                placeholder="123 Main Street"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                required
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                placeholder="Mumbai"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">PIN Code</label>
                                            <input
                                                type="text"
                                                name="zip"
                                                required
                                                value={formData.zip}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                placeholder="400001"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="w-6 h-6 text-amber-500" />
                                        <h2 className="text-2xl font-bold text-slate-800">Payment Details</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                required
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength="19"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    name="expiry"
                                                    required
                                                    value={formData.expiry}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                    placeholder="MM/YY"
                                                    maxLength="5"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    required
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
                                                    placeholder="***"
                                                    maxLength="4"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
                                            <Shield className="w-5 h-5 text-green-500" />
                                            Your payment info is encrypted and secure
                                        </div>
                                    </div>
                                </>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-8"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : step === 1 ? 'Continue to Payment' : `Pay ₹${total.toFixed(0)}`}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h3>

                            {/* Cart Items */}
                            <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-800 truncate">{item.title}</p>
                                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                            <p className="text-amber-600 font-medium">₹{(item.price * item.quantity).toFixed(0)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-slate-200 pt-4 space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-lg text-slate-800 pt-3 border-t border-slate-200">
                                    <span>Total</span>
                                    <span className="text-amber-600">₹{total.toFixed(0)}</span>
                                </div>
                            </div>

                            {shipping > 0 && (
                                <p className="text-xs text-slate-500 mt-4 text-center">
                                    Add ₹{(500 - cartTotal).toFixed(0)} more for free shipping!
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
