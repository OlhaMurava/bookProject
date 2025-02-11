// Function to validate book data
export function validateBookData(title, author, isbn, description, rating) {
    // Check if title, author, and isbn are provided
    if (!title || !author || !isbn) {
        return "Title, author, and ISBN are required.";
    }

    // Check if ISBN is valid (either ISBN-10 or ISBN-13)
    const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
    if (!isbnRegex.test(isbn)) {
        return "ISBN must be valid (either ISBN-10 or ISBN-13).";
    }

    // Validate rating (must be between 1 and 5)
    if (rating && (isNaN(rating) || rating < 1 || rating > 5)) {
        return "Rating must be a number between 1 and 5.";
    }

    return null;
}
