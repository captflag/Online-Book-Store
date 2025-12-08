// Firestore service for Orders (Sales Management) with Analytics
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { updateStock } from './books';

let db = null;

// Initialize Firestore lazily
async function getDb() {
    if (!db) {
        try {
            const firebase = await import('./firebase');
            db = firebase.db;
        } catch (error) {
            console.warn('Firebase not configured. Orders will not be saved.');
            return null;
        }
    }
    return db;
}

// Order status constants
export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Demo orders for analytics demonstration
const DEMO_ORDERS = [
    {
        id: 'demo-001',
        items: [
            { bookId: '1', title: 'The Palace of Illusions', author: 'Chitra Banerjee Divakaruni', price: 399, quantity: 2, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800' },
            { bookId: '3', title: 'Ikigai', author: 'Héctor García', price: 299, quantity: 1, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Rahul Sharma', email: 'rahul@example.com', address: '123 MG Road', city: 'Mumbai', zip: '400001' },
        subtotal: 1097, shipping: 0, total: 1097,
        status: ORDER_STATUS.DELIVERED,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
        id: 'demo-002',
        items: [
            { bookId: '4', title: 'Wings of Fire', author: 'Dr. A.P.J. Abdul Kalam', price: 199, quantity: 3, cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Priya Patel', email: 'priya@example.com', address: '456 Ring Road', city: 'Delhi', zip: '110001' },
        subtotal: 597, shipping: 0, total: 597,
        status: ORDER_STATUS.SHIPPED,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
        id: 'demo-003',
        items: [
            { bookId: '6', title: 'Atomic Habits', author: 'James Clear', price: 499, quantity: 1, cover: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31238?auto=format&fit=crop&q=80&w=800' },
            { bookId: '8', title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', price: 399, quantity: 1, cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Amit Kumar', email: 'amit@example.com', address: '789 Lake View', city: 'Bangalore', zip: '560001' },
        subtotal: 898, shipping: 0, total: 898,
        status: ORDER_STATUS.DELIVERED,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    },
    {
        id: 'demo-004',
        items: [
            { bookId: '2', title: 'The God of Small Things', author: 'Arundhati Roy', price: 350, quantity: 1, cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Sneha Reddy', email: 'sneha@example.com', address: '321 Hill View', city: 'Hyderabad', zip: '500001' },
        subtotal: 350, shipping: 50, total: 400,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) // 12 hours ago
    },
    {
        id: 'demo-005',
        items: [
            { bookId: '5', title: 'The White Tiger', author: 'Aravind Adiga', price: 450, quantity: 1, cover: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800' },
            { bookId: '7', title: 'Train to Pakistan', author: 'Khushwant Singh', price: 250, quantity: 2, cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Vikram Singh', email: 'vikram@example.com', address: '555 Park Street', city: 'Kolkata', zip: '700001' },
        subtotal: 950, shipping: 0, total: 950,
        status: ORDER_STATUS.CONFIRMED,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    },
    {
        id: 'demo-006',
        items: [
            { bookId: '1', title: 'The Palace of Illusions', author: 'Chitra Banerjee Divakaruni', price: 399, quantity: 1, cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Ananya Iyer', email: 'ananya@example.com', address: '888 Beach Road', city: 'Chennai', zip: '600001' },
        subtotal: 399, shipping: 50, total: 449,
        status: ORDER_STATUS.DELIVERED,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
    },
    {
        id: 'demo-007',
        items: [
            { bookId: '3', title: 'Ikigai', author: 'Héctor García', price: 299, quantity: 2, cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800' },
            { bookId: '6', title: 'Atomic Habits', author: 'James Clear', price: 499, quantity: 1, cover: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31238?auto=format&fit=crop&q=80&w=800' }
        ],
        customer: { name: 'Deepak Verma', email: 'deepak@example.com', address: '222 Civil Lines', city: 'Jaipur', zip: '302001' },
        subtotal: 1097, shipping: 0, total: 1097,
        status: ORDER_STATUS.DELIVERED,
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
    }
];

// Create a new order
export async function createOrder(orderData) {
    const database = await getDb();

    const order = {
        items: orderData.items.map(item => ({
            bookId: item.id,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity,
            cover: item.cover,
            category: item.category || 'General'
        })),
        customer: {
            name: orderData.customer.name,
            email: orderData.customer.email,
            address: orderData.customer.address,
            city: orderData.customer.city,
            zip: orderData.customer.zip
        },
        payment: {
            method: 'card',
            last4: orderData.payment?.cardNumber?.slice(-4) || '****'
        },
        subtotal: orderData.subtotal,
        shipping: orderData.shipping || 0,
        total: orderData.total,
        status: ORDER_STATUS.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    if (!database) {
        console.log('Mock: Order created', order);
        return {
            id: 'mock-' + Date.now(),
            ...order,
            createdAt: new Date().toISOString()
        };
    }

    try {
        const ordersRef = collection(database, 'orders');
        const docRef = await addDoc(ordersRef, {
            ...order,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        for (const item of orderData.items) {
            await updateStock(item.id, -item.quantity);
        }

        return { id: docRef.id, ...order };
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Get order by ID
export async function getOrderById(orderId) {
    const database = await getDb();
    if (!database) throw new Error('Database not configured');

    const orderRef = doc(database, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);

    if (!orderSnap.exists()) {
        throw new Error('Order not found');
    }

    return { id: orderSnap.id, ...orderSnap.data() };
}

// Get all orders (Admin function) - with demo data fallback
export async function getAllOrders() {
    const database = await getDb();
    if (!database) {
        // Return demo orders for visualization
        return DEMO_ORDERS;
    }

    try {
        const ordersRef = collection(database, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // If no real orders, return demo data
        return orders.length > 0 ? orders : DEMO_ORDERS;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return DEMO_ORDERS;
    }
}

// Get orders by user email
export async function getOrdersByEmail(email) {
    const database = await getDb();
    if (!database) {
        return DEMO_ORDERS.filter(o => o.customer.email === email);
    }

    try {
        const ordersRef = collection(database, 'orders');
        const q = query(
            ordersRef,
            where('customer.email', '==', email),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return [];
    }
}

// Update order status (Admin function)
export async function updateOrderStatus(orderId, status) {
    const database = await getDb();
    if (!database) {
        console.log(`Mock: Updated order ${orderId} to ${status}`);
        return { id: orderId, status };
    }

    const orderRef = doc(database, 'orders', orderId);
    await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
    });

    return { id: orderId, status };
}

// ==================== ANALYTICS FUNCTIONS ====================

// Get comprehensive sales statistics
export async function getSalesStats() {
    const orders = await getAllOrders();

    let totalRevenue = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let shippedOrders = 0;
    let cancelledOrders = 0;

    orders.forEach(order => {
        totalRevenue += order.total || 0;
        switch (order.status) {
            case ORDER_STATUS.PENDING: pendingOrders++; break;
            case ORDER_STATUS.DELIVERED: deliveredOrders++; break;
            case ORDER_STATUS.SHIPPED: shippedOrders++; break;
            case ORDER_STATUS.CANCELLED: cancelledOrders++; break;
        }
    });

    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    return {
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
        shippedOrders,
        cancelledOrders,
        avgOrderValue
    };
}

// Get top selling books
export async function getTopSellingBooks(limit = 5) {
    const orders = await getAllOrders();
    const bookSales = {};

    orders.forEach(order => {
        if (order.status !== ORDER_STATUS.CANCELLED) {
            order.items?.forEach(item => {
                const key = item.bookId || item.title;
                if (!bookSales[key]) {
                    bookSales[key] = {
                        title: item.title,
                        author: item.author,
                        cover: item.cover,
                        totalSold: 0,
                        revenue: 0
                    };
                }
                bookSales[key].totalSold += item.quantity;
                bookSales[key].revenue += item.price * item.quantity;
            });
        }
    });

    return Object.values(bookSales)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, limit);
}

// Get revenue by category
export async function getRevenueByCategory() {
    const orders = await getAllOrders();
    const categoryRevenue = {};

    // Category mapping based on book titles (since category might not be stored)
    const categoryMap = {
        'The Palace of Illusions': 'Fiction',
        'The God of Small Things': 'Fiction',
        'Ikigai': 'Self-Help',
        'Wings of Fire': 'Biography',
        'The White Tiger': 'Fiction',
        'Atomic Habits': 'Self-Help',
        'Train to Pakistan': 'Historical Fiction',
        'Rich Dad Poor Dad': 'Finance'
    };

    orders.forEach(order => {
        if (order.status !== ORDER_STATUS.CANCELLED) {
            order.items?.forEach(item => {
                const category = item.category || categoryMap[item.title] || 'Other';
                if (!categoryRevenue[category]) {
                    categoryRevenue[category] = 0;
                }
                categoryRevenue[category] += item.price * item.quantity;
            });
        }
    });

    const total = Object.values(categoryRevenue).reduce((a, b) => a + b, 0);

    return Object.entries(categoryRevenue).map(([category, revenue]) => ({
        category,
        revenue,
        percentage: total > 0 ? Math.round((revenue / total) * 100) : 0
    })).sort((a, b) => b.revenue - a.revenue);
}

// Get sales by day (last 7 days)
export async function getSalesByDay(days = 7) {
    const orders = await getAllOrders();
    const dailySales = {};

    // Initialize last N days
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        dailySales[dateKey] = { orders: 0, revenue: 0 };
    }

    orders.forEach(order => {
        if (order.status !== ORDER_STATUS.CANCELLED) {
            const orderDate = order.createdAt?.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
            const dateKey = orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

            if (dailySales[dateKey]) {
                dailySales[dateKey].orders += 1;
                dailySales[dateKey].revenue += order.total || 0;
            }
        }
    });

    return Object.entries(dailySales)
        .map(([date, data]) => ({ date, ...data }))
        .reverse();
}

// Get top authors by revenue
export async function getTopAuthors(limit = 5) {
    const orders = await getAllOrders();
    const authorStats = {};

    orders.forEach(order => {
        if (order.status !== ORDER_STATUS.CANCELLED) {
            order.items?.forEach(item => {
                const author = item.author;
                if (!authorStats[author]) {
                    authorStats[author] = { name: author, booksSold: 0, revenue: 0 };
                }
                authorStats[author].booksSold += item.quantity;
                authorStats[author].revenue += item.price * item.quantity;
            });
        }
    });

    return Object.values(authorStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
}

// Get orders by city
export async function getOrdersByCity() {
    const orders = await getAllOrders();
    const cityOrders = {};

    orders.forEach(order => {
        const city = order.customer?.city || 'Unknown';
        if (!cityOrders[city]) {
            cityOrders[city] = { city, orders: 0, revenue: 0 };
        }
        cityOrders[city].orders += 1;
        cityOrders[city].revenue += order.total || 0;
    });

    return Object.values(cityOrders).sort((a, b) => b.orders - a.orders);
}

// Get customer insights
export async function getCustomerInsights() {
    const orders = await getAllOrders();
    const customers = {};

    orders.forEach(order => {
        const email = order.customer?.email;
        if (email) {
            if (!customers[email]) {
                customers[email] = {
                    name: order.customer.name,
                    email: email,
                    orderCount: 0,
                    totalSpent: 0
                };
            }
            customers[email].orderCount += 1;
            customers[email].totalSpent += order.total || 0;
        }
    });

    const customerList = Object.values(customers);
    const repeatCustomers = customerList.filter(c => c.orderCount > 1).length;

    return {
        totalCustomers: customerList.length,
        repeatCustomers,
        repeatRate: customerList.length > 0 ? Math.round((repeatCustomers / customerList.length) * 100) : 0,
        topCustomers: customerList.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5)
    };
}
