import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    if (!currentUser) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
                <Button onClick={() => navigate('/login')}>Log In</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-heading font-bold">My Profile</h1>
                <Button variant="outline" onClick={() => logout().then(() => navigate('/'))}>Sign Out</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* User Info */}
                <div className="bg-card border border-white/5 p-6 rounded-xl shadow-glass h-fit">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
                            {currentUser.email[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold">{currentUser.displayName || 'Reader'}</p>
                            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Member Since</span>
                            <span>{new Date(currentUser.metadata.creationTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Orders</span>
                            <span>3</span>
                        </div>
                    </div>
                </div>

                {/* Order History */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-heading font-bold mb-4">Order History</h2>

                    {/* Mock Orders */}
                    {[1, 2, 3].map((order) => (
                        <div key={order} className="bg-card border border-white/5 p-6 rounded-xl hover:border-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold">Order #{Math.floor(Math.random() * 10000)}</h3>
                                    <p className="text-sm text-muted-foreground">Placed on {new Date().toLocaleDateString()}</p>
                                </div>
                                <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold">
                                    Delivered
                                </span>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-16 bg-secondary rounded"></div>
                                <div className="w-12 h-16 bg-secondary rounded"></div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-sm font-medium">Total Amount</span>
                                <span className="font-bold text-lg">${(Math.random() * 100).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
