import { getAllBooks, addBook, getBookByIsbnFromDb, updateBookInDb, deleteBookFromDb } from "../db/db.js";
import { validateBookData } from "../validation/validation.js";

// GET all books
export async function getBooks(req, res) {
    try {
        const result = await getAllBooks();
        res.render("index.ejs", { bookItems: result.rows });
    } catch (err) {
        res.status(500).send("Error fetching books");
    }
}

// POST a new book
export async function postBook(req, res) {
    const { title, author, isbn, description, rating } = req.body;
    const validationError = validateBookData(title, author, isbn, description, rating);
    if (validationError) {
        return res.status(400).send("Error: " + validationError);
    }
    try {
        await addBook(req.body);
        res.redirect('/');
    } catch (err) {
        res.status(400).send("Error: " + err.message);
    }
}

// GET a single book by ISBN
export async function getBookByIsbn(req, res) {
    const { isbn } = req.params;
    try {
        const result = await getBookByIsbnFromDb(isbn);
        if (result.rows.length > 0) {
            res.render("edit.ejs", { book: result.rows[0] });
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        res.status(500).send("Error fetching book details");
    }
}

// PUT update a book
export async function updateBook(req, res) {
    const { isbn } = req.params;
    const { title, author, description, rating } = req.body;
    const validationError = validateBookData(title, author, isbn, description, rating);
    if (validationError) {
        return res.status(400).send("Error: " + validationError);
    }
    try {
        await updateBookInDb({ title, author, description, rating, isbn });
        res.status(200).send("Book updated successfully");
    } catch (err) {
        res.status(500).send("Error updating book");
    }
}

// DELETE a book
export async function deleteBook(req, res) {
    const { isbn } = req.params;
    try {
        await deleteBookFromDb(isbn);
        res.status(200).send("Book deleted successfully");
    } catch (err) {
        res.status(500).send("Error deleting book");
    }
}
