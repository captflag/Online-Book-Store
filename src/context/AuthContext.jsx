import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Check if Firebase is configured
let auth = null;
let firebaseAuthMethods = null;

try {
    const firebase = await import('../lib/firebase');
    auth = firebase.auth;
    firebaseAuthMethods = await import('firebase/auth');
} catch (error) {
    console.warn('Firebase not configured. Running in demo mode without authentication.');
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        if (!auth || !firebaseAuthMethods) {
            console.warn('Firebase not configured');
            return Promise.reject(new Error('Firebase not configured'));
        }
        return firebaseAuthMethods.createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        if (!auth || !firebaseAuthMethods) {
            console.warn('Firebase not configured');
            return Promise.reject(new Error('Firebase not configured'));
        }
        return firebaseAuthMethods.signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        if (!auth || !firebaseAuthMethods) {
            return Promise.resolve();
        }
        return firebaseAuthMethods.signOut(auth);
    }

    function googleSignIn() {
        if (!auth || !firebaseAuthMethods) {
            console.warn('Firebase not configured');
            return Promise.reject(new Error('Firebase not configured'));
        }
        const provider = new firebaseAuthMethods.GoogleAuthProvider();
        return firebaseAuthMethods.signInWithPopup(auth, provider);
    }

    useEffect(() => {
        // If Firebase is not configured, skip auth state listener
        if (!auth || !firebaseAuthMethods) {
            setLoading(false);
            return;
        }

        const unsubscribe = firebaseAuthMethods.onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout,
        googleSignIn
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
