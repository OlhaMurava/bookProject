import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Initialize Express
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

// Initialize PostgreSQL client
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "books",
    password: "2856",
    port: 5432,
})

// Connect to the database
db.connect();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Array to store books data
let books = [];

app.get('/', async (req, res) => {
    try {
        // Fetch all books from the database and store them in the 'books' array
        const result = await db.query("SELECT * FROM books ORDER BY id ASC");
        books = result.rows;

        // Render the home page with the list of books
        res.render("index.ejs", {
            bookItems: books,
        });
    } catch (err) {
        console.log(err);
    }
});

app.post('/add-book', async (req, res) => {
    const { title, author, isbn, description, rating } = req.body;

    try {
        if (!isbn) {
            throw new Error("ISBN is required.");
        }

        await db.query(
            "INSERT INTO books (title, author, isbn, description, rating) VALUES ($1, $2, $3, $4, $5)",
            [title, author, isbn, description, rating]
        );
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(400).send("Error: " + err.message);
    }
});

app.get('/update-book/:isbn', async (req, res) => {
    const { isbn } = req.params;

    try {
        const result = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
        const book = result.rows[0];

        if (book) {
            res.render("edit.ejs", { book });
        } else {
            res.status(404).send("Book not found");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching book details");
    }
});

// Edit book route
app.post('/update-book', async (req, res) => {
    const { isbn, title, author, description, rating } = req.body;

    try {
        await db.query(
            "UPDATE books SET title = $1, author = $2, description = $3, rating = $4 WHERE isbn = $5",
            [title, author, description, rating, isbn]
        );
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error updating book");
    }
});

// Delete book route
app.post('/delete-book', async (req, res) => {
    const { isbn } = req.body;
    try {
        await db.query("DELETE FROM books WHERE isbn = $1", [isbn]);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting book");
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});