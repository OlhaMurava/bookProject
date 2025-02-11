import pg from 'pg';

// Initialize PostgreSQL client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "2856",
    port: 5432,
});

// Connect to the database
db.connect();

// Function to get all books
export async function getAllBooks() {
    return await db.query("SELECT * FROM books ORDER BY id ASC");
}

// Function to add a new book
export async function addBook(bookData) {
    const { title, author, isbn, description, rating } = bookData;
    await db.query(
        "INSERT INTO books (title, author, isbn, description, rating) VALUES ($1, $2, $3, $4, $5)",
        [title, author, isbn, description, rating]
    );
}

// Function to get a book by ISBN
export async function getBookByIsbnFromDb(isbn) {
    return await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
}

// Function to update a book
export async function updateBookInDb(bookData) {
    const { title, author, description, rating, isbn } = bookData;
    await db.query(
        "UPDATE books SET title = $1, author = $2, description = $3, rating = $4 WHERE isbn = $5",
        [title, author, description, rating, isbn]
    );
}

// Function to delete a book
export async function deleteBookFromDb(isbn) {
    await db.query("DELETE FROM books WHERE isbn = $1", [isbn]);
}
