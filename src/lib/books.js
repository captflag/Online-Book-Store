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
const INITIAL_BOOKS = [
    {
        id: "1",
        title: "The Palace of Illusions",
        author: "Chitra Banerjee Divakaruni",
        price: 399,
        originalPrice: 499,
        category: "Fiction",
        rating: 4.8,
        stock: 25,
        cover: "https://covers.openlibrary.org/b/isbn/9781400096206-L.jpg",
        authorImage: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Chitra_Banerjee_Divakaruni.jpg",
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
        cover: "https://covers.openlibrary.org/b/isbn/9780812979657-L.jpg",
        authorImage: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Arundhati_Roy_W.jpg",
        description: "A story of forbidden love set against the backdrop of Kerala's lush landscapes and rigid social hierarchy."
    },
    {
        id: "3",
        title: "Ikigai: The Japanese Secret",
        author: "Héctor García",
        price: 299,
        category: "Self-Help",
        rating: 4.9,
        stock: 50,
        cover: "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg",
        authorImage: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
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
        cover: "https://covers.openlibrary.org/b/isbn/9788173711466-L.jpg",
        authorImage: "https://upload.wikimedia.org/wikipedia/commons/b/b0/A._P._J._Abdul_Kalam.jpg",
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
        cover: "https://covers.openlibrary.org/b/isbn/9781416562603-L.jpg",
        authorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Aravind_Adiga_by_David_Shankbone.jpg/480px-Aravind_Adiga_by_David_Shankbone.jpg",
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
        cover: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
        authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
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
        cover: "https://covers.openlibrary.org/b/isbn/9780143027799-L.jpg",
        authorImage: "https://upload.wikimedia.org/wikipedia/commons/3/36/Khushwant_Singh_-_KOL_2013-11-10_4384.JPG",
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
        cover: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
        authorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Robert_Kiyosaki_by_Gage_Skidmore.jpg/480px-Robert_Kiyosaki_by_Gage_Skidmore.jpg",
        description: "What the rich teach their kids about money that the poor and middle class do not."
    }
];

// --- REAL BOOK POOL ---
const REAL_BOOK_POOL = [
    // Fiction
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", isbn: "9780743273565", authorImage: "https://upload.wikimedia.org/wikipedia/commons/5/5c/F_Scott_Fitzgerald_1921.jpg" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", isbn: "9780062420701", authorImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=200" },
    { title: "1984", author: "George Orwell", category: "Fiction", isbn: "9780452262935", authorImage: "https://upload.wikimedia.org/wikipedia/commons/7/7e/George_Orwell_press_photo.jpg" },
    { title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", isbn: "9780062315007", authorImage: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Paulo_Coelho_1.jpg" },

    // Sci-Fi
    { title: "Dune", author: "Frank Herbert", category: "Sci-Fi", isbn: "9780441005901", authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
    { title: "Fahrenheit 451", author: "Ray Bradbury", category: "Sci-Fi", isbn: "9781451673319", authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" },
    { title: "The Martian", author: "Andy Weir", category: "Sci-Fi", isbn: "9780553418026", authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200" },

    // Mystery
    { title: "The Da Vinci Code", author: "Dan Brown", category: "Mystery", isbn: "9780307474278", authorImage: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Dan_Brown_book_signing.jpg" },
    { title: "Gone Girl", author: "Gillian Flynn", category: "Mystery", isbn: "9780307588371", authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" },
    { title: "Murder on the Orient Express", author: "Agatha Christie", category: "Mystery", isbn: "9780062073495", authorImage: "https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png" },

    // Business & Tech
    { title: "Steve Jobs", author: "Walter Isaacson", category: "Technology", isbn: "9781451648539", authorImage: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Walter_Isaacson_at_Miami_Book_Fair_International_2011.jpg" },
    { title: "Elon Musk", author: "Ashlee Vance", category: "Technology", isbn: "9780062301239", authorImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200" },
    { title: "Clean Code", author: "Robert C. Martin", category: "Technology", isbn: "9780132350884", authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200" },
    { title: "Zero to One", author: "Peter Thiel", category: "Business", isbn: "9780804139298", authorImage: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Peter_Thiel_at_TechCrunch_Disrupt_SF_2013-4886_%289745585094%29_%28cropped%29.jpg" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Business", isbn: "9780374275631", authorImage: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Daniel_Kahneman_2017.jpg" },

    // Biography / History
    { title: "Becoming", author: "Michelle Obama", category: "Biography", isbn: "9781524763138", authorImage: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Michelle_Obama_2013_official_portrait.jpg" },
    { title: "Educated", author: "Tara Westover", category: "Biography", isbn: "9780399590504", authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200" },
    { title: "Sapiens", author: "Yuval Noah Harari", category: "History", isbn: "9780062316110", authorImage: "https://upload.wikimedia.org/wikipedia/commons/9/91/Yuval_Noah_Harari_cropped.jpg" },

    // Self-Help
    { title: "The Power of Now", author: "Eckhart Tolle", category: "Self-Help", isbn: "9781577314806", authorImage: "https://upload.wikimedia.org/wikipedia/commons/9/96/Eckhart_Tolle_November_2015_%28cropped%29.jpg" },
    { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", category: "Fantasy", isbn: "9781338299144", authorImage: "https://upload.wikimedia.org/wikipedia/commons/5/5d/J._K._Rowling_2010.jpg" },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", category: "Fantasy", isbn: "9780618640157", authorImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/J._R._R._Tolkien%2C_ca._1925.jpg/330px-J._R._R._Tolkien%2C_ca._1925.jpg" }
];

function generateMockBooks(count) {
    const generated = [];

    for (let i = 0; i < count; i++) {
        // Sample from the real pool cyclically or randomly
        const template = REAL_BOOK_POOL[i % REAL_BOOK_POOL.length];

        generated.push({
            id: `gen_${i + 9}`,
            title: template.title,
            author: template.author,
            category: template.category,
            price: Math.floor(Math.random() * 800) + 150,
            originalPrice: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 900 : null,
            rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
            stock: Math.floor(Math.random() * 100) + 5,
            cover: `https://covers.openlibrary.org/b/isbn/${template.isbn}-L.jpg`,
            authorImage: template.authorImage,
            description: `A masterpiece by ${template.author}, ${template.title} is a defining work in the ${template.category} genre. This edition captures the essence of the original work, bringing its timeless message to a new generation of readers.`
        });
    }
    return generated;
}

const MOCK_BOOKS = [...INITIAL_BOOKS, ...generateMockBooks(1000)];

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

// Get related books by category
export async function getRelatedBooks(currentId, category) {
    const database = await getDb();

    // Always get mock recommendations
    const mockRelated = MOCK_BOOKS
        .filter(b => b.category === category && b.id !== currentId);

    if (!database) {
        // Return only mock data with simulated delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockRelated.slice(0, 4));
            }, 300);
        });
    }

    try {
        const booksRef = collection(database, 'books');
        const q = query(
            booksRef,
            where("category", "==", category),
            orderBy("rating", "desc") // Show highest rated books first
        );

        const snapshot = await getDocs(q);
        const dbBooks = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(book => book.id !== currentId);

        // Combine DB results with Mock buffer (prioritizing DB)
        const combined = [...dbBooks];
        const dbIds = new Set(dbBooks.map(b => b.id));

        for (const book of mockRelated) {
            if (!dbIds.has(book.id)) {
                combined.push(book);
            }
        }

        return combined.slice(0, 4);
    } catch (error) {
        console.error('Error fetching related books:', error);
        // Fallback to mock
        return mockRelated.slice(0, 4);
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

    // Batch writes for performance
    // Note: Firebase batch is limited to 500 ops. We have 1000+ books.
    // We will do it in chunks.
    const chunks = [];
    const chunkSize = 400;

    for (let i = 0; i < MOCK_BOOKS.length; i += chunkSize) {
        chunks.push(MOCK_BOOKS.slice(i, i + chunkSize));
    }

    console.log(`Seeding ${MOCK_BOOKS.length} books in ${chunks.length} batches...`);

    let count = 0;
    for (const chunk of chunks) {
        const batch = (await import('firebase/firestore')).writeBatch(database);

        for (const book of chunk) {
            const { id, ...bookData } = book;
            // Use specific IDs if possible, or auto-id if mixed. 
            // Our MOCK_BOOKS have IDs. Let's use them as doc IDs to ensure consistency.
            const docRef = doc(booksRef, id);
            batch.set(docRef, {
                ...bookData,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        await batch.commit();
        count += chunk.length;
        console.log(`Seeded ${count} books...`);
    }

    console.log('Books seeded successfully!');
}

// DANGEROUS: Wipes the entire books collection
export async function resetDatabase() {
    const database = await getDb();
    if (!database) {
        console.warn('Cannot reset: Database not configured');
        return;
    }

    console.log('RESETTING DATABASE...');
    const booksRef = collection(database, 'books');
    const snapshot = await getDocs(booksRef);

    if (snapshot.empty) {
        console.log('Database already empty.');
        await seedBooks();
        return;
    }

    const chunks = [];
    const chunkSize = 400;
    const docs = snapshot.docs;

    for (let i = 0; i < docs.length; i += chunkSize) {
        chunks.push(docs.slice(i, i + chunkSize));
    }

    // Delete all existing
    for (const chunk of chunks) {
        const batch = (await import('firebase/firestore')).writeBatch(database);
        for (const doc of chunk) {
            batch.delete(doc.ref);
        }
        await batch.commit();
    }

    console.log('Database cleared. Re-seeding...');
    await seedBooks();
}
