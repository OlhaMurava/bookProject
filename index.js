import express from "express";
import bodyParser from "body-parser";
import { getBooks, postBook, getBookByIsbn, updateBook, deleteBook } from "./controllers/bookController.js";

// Initialize Express
const app = express();
const port = 3000;
app.set('view engine', 'ejs');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.get('/', getBooks);
app.post('/books', postBook);
app.get('/books/:isbn', getBookByIsbn);
app.put('/books/:isbn', updateBook);
app.delete('/books/:isbn', deleteBook);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
