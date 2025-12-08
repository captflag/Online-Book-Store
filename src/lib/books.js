// Firestore service for Books (Inventory Management)
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    increment
} from 'firebase/firestore';

let db = null;

// Initialize Firestore lazily
async function getDb() {
    if (!db) {
        try {
            const firebase = await import('./firebase');
            db = firebase.db;
        } catch (error) {
            console.warn('Firebase not configured. Using mock data.');
            return null;
        }
    }
    return db;
}

// Fallback mock data for when Firebase isn't configured
const MOCK_BOOKS = [
    {
        id: "1",
        title: "The Palace of Illusions",
        author: "Chitra Banerjee Divakaruni",
        price: 399,
        originalPrice: 499,
        category: "Fiction",
        rating: 4.8,
        stock: 25,
        cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        description: "The Mahabharata reimagined through the eyes of Draupadi, one of literature's most compelling heroines."
    },
    {
        id: "2",
        title: "The God of Small Things",
        author: "Arundhati Roy",
        price: 350,
        originalPrice: 425,
        category: "Fiction",
        rating: 4.7,
        stock: 18,
        cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
        description: "A story of forbidden love set against the backdrop of Kerala's lush landscapes and rigid social hierarchy."
    },
    {
        id: "3",
        title: "Ikigai: The Japanese Secret",
        author: "Héctor García & Francesc Miralles",
        price: 299,
        category: "Self-Help",
        rating: 4.9,
        stock: 50,
        cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800",
        description: "Discover the Japanese concept of finding purpose and living a longer, happier life."
    },
    {
        id: "4",
        title: "Wings of Fire",
        author: "Dr. A.P.J. Abdul Kalam",
        price: 199,
        category: "Biography",
        rating: 4.9,
        stock: 100,
        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
        description: "An inspiring autobiography of India's beloved Missile Man and former President."
    },
    {
        id: "5",
        title: "The White Tiger",
        author: "Aravind Adiga",
        price: 450,
        category: "Fiction",
        rating: 4.5,
        stock: 15,
        cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=800",
        description: "A darkly humorous tale of ambition, social inequality, and the harsh realities of modern India."
    },
    {
        id: "6",
        title: "Atomic Habits",
        author: "James Clear",
        price: 499,
        originalPrice: 599,
        category: "Self-Help",
        rating: 4.8,
        stock: 35,
        cover: "https://images.unsplash.com/photo-1626618012641-bfbca5a31238?auto=format&fit=crop&q=80&w=800",
        description: "An easy, proven way to build good habits and break bad ones."
    },
    {
        id: "7",
        title: "Train to Pakistan",
        author: "Khushwant Singh",
        price: 250,
        category: "Historical Fiction",
        rating: 4.6,
        stock: 20,
        cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800",
        description: "A powerful story set during the Partition of India, exploring humanity amid chaos."
    },
    {
        id: "8",
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        price: 399,
        category: "Finance",
        rating: 4.7,
        stock: 45,
        cover: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800",
        description: "What the rich teach their kids about money that the poor and middle class do not."
    }
];

// Get all books from Firestore or mock data
export async function getBooks() {
    const database = await getDb();

    if (!database) {
        // Return mock data with simulated delay
        return new Promise((resolve) => {
            setTimeout(() => resolve(MOCK_BOOKS), 300);
        });
    }

    try {
        const booksRef = collection(database, 'books');
        const snapshot = await getDocs(booksRef);

        if (snapshot.empty) {
            console.log('No books in database, seeding...');
            await seedBooks();
            return MOCK_BOOKS;
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching books:', error);
        return MOCK_BOOKS;
    }
}

// Get a single book by ID
export async function getBookById(id) {
    const database = await getDb();

    if (!database) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = MOCK_BOOKS.find(b => b.id === id);
                if (book) resolve(book);
                else reject(new Error("Book not found"));
            }, 300);
        });
    }

    try {
        const bookRef = doc(database, 'books', id);
        const bookSnap = await getDoc(bookRef);

        if (!bookSnap.exists()) {
            throw new Error("Book not found");
        }

        return { id: bookSnap.id, ...bookSnap.data() };
    } catch (error) {
        console.error('Error fetching book:', error);
        // Fallback to mock data
        const book = MOCK_BOOKS.find(b => b.id === id);
        if (book) return book;
        throw error;
    }
}

// Add a new book (Admin function)
export async function addBook(bookData) {
    const database = await getDb();
    if (!database) throw new Error('Database not configured');

    const booksRef = collection(database, 'books');
    const docRef = await addDoc(booksRef, {
        ...bookData,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    return { id: docRef.id, ...bookData };
}

// Update a book (Admin function)
export async function updateBook(id, updates) {
    const database = await getDb();
    if (!database) throw new Error('Database not configured');

    const bookRef = doc(database, 'books', id);
    await updateDoc(bookRef, {
        ...updates,
        updatedAt: new Date()
    });
    return { id, ...updates };
}

// Delete a book (Admin function)
export async function deleteBook(id) {
    const database = await getDb();
    if (!database) throw new Error('Database not configured');

    const bookRef = doc(database, 'books', id);
    await deleteDoc(bookRef);
    return true;
}

// Update stock quantity
export async function updateStock(bookId, quantityChange) {
    const database = await getDb();
    if (!database) {
        console.log(`Mock: Updating stock for ${bookId} by ${quantityChange}`);
        return true;
    }

    const bookRef = doc(database, 'books', bookId);
    await updateDoc(bookRef, {
        stock: increment(quantityChange),
        updatedAt: new Date()
    });
    return true;
}

// Seed initial books to Firestore
export async function seedBooks() {
    const database = await getDb();
    if (!database) {
        console.log('Cannot seed: Database not configured');
        return;
    }

    const booksRef = collection(database, 'books');

    for (const book of MOCK_BOOKS) {
        const { id, ...bookData } = book;
        await addDoc(booksRef, {
            ...bookData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    console.log('Books seeded successfully!');
}
