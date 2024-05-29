const books = [
    { title: "A Light in the Attic", category: "Poetry", rating: 3, price: 51.77, stock: 22 },
    { title: "Tipping the Velvet", category: "Historical Fiction", rating: 1, price: 53.74, stock: 20 },
    { title: "Soumission", category: "Fiction", rating: 1, price: 50.1, stock: 20 },
    { title: "Sharp Objects", category: "Mystery", rating: 4, price: 47.82, stock: 20 },
    { title: "Sapiens: A Brief History of Humankind", category: "History", rating: 5, price: 54.23, stock: 20 },
    { title: "The Requiem Red", category: "Young Adult", rating: 1, price: 22.65, stock: 19 },
    { title: "The Dirty Little Secrets of Getting Your Dream Job", category: "Business", rating: 4, price: 33.34, stock: 19 },
    { title: "The Coming Woman: A Novel Based on the Life of the Infamous Feminist, Victoria Woodhull", category: "Default", rating: 3, price: 17.93, stock: 19 },
    { title: "The Boys in the Boat: Nine Americans and Their Epic Quest for Gold at the 1936 Berlin Olympics", category: "Default", rating: 4, price: 22.6, stock: 19 },
    { title: "The Black Maria", category: "Poetry", rating: 1, price: 52.15, stock: 19 },
    { title: "Starving Hearts (Triangular Trade Trilogy, #1)", category: "Default", rating: 2, price: 13.99, stock: 19 },
    { title: "Shakespeare's Sonnets", category: "Poetry", rating: 4, price: 20.66, stock: 19 },
    { title: "Set Me Free", category: "Young Adult", rating: 5, price: 17.46, stock: 19 },
    { title: "Scott Pilgrim's Precious Little Life (Scott Pilgrim #1)", category: "Sequential Art", rating: 5, price: 52.29, stock: 19 },
    { title: "Rip it Up and Start Again", category: "Music", rating: 5, price: 35.02, stock: 19 },
    { title: "Our Band Could Be Your Life: Scenes from the American Indie Underground, 1981-1991", category: "Music", rating: 3, price: 57.25, stock: 19 },
    { title: "Olio", category: "Poetry", rating: 1, price: 23.88, stock: 19 },
    { title: "Mesaerion: The Best Science Fiction Stories 1800-1849", category: "Science Fiction", rating: 1, price: 37.59, stock: 19 },
    { title: "Libertarianism for Beginners", category: "Politics", rating: 2, price: 51.33, stock: 19 },
    { title: "It's Only the Himalayas", category: "Travel", rating: 2, price: 45.17, stock: 19 }
];


//          Promosi Buku Terbaik
function selectBestBooks(books, maxBooks = 5) {
    // Sort books based on rating and stock
    books.sort((a, b) => {
        if (b.rating === a.rating) {
            return b.stock - a.stock;
        }
        return b.rating - a.rating;
    });

    // Select top books based on sorted criteria
    return books.slice(0, maxBooks);
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');
        bookDiv.innerHTML = `
            <h2>${book.title}</h2>
            <p>Category: ${book.category}</p>
            <p>Rating: ${book.rating}</p>
            <p>Price: $${book.price}</p>
            <p>Stock: ${book.stock}</p>
        `;
        bookList.appendChild(bookDiv);
    });
}

const bestBooks = selectBestBooks(books);
displayBooks(bestBooks);


function findSubsetBooks() {
    const targetPrice = parseFloat(document.getElementById('targetPrice').value) * 100;
    const n = books.length;
    
    // Initialize DP table with Infinity for prices and -Infinity for ratings
    const dp = Array.from({ length: n + 1 }, () => Array(targetPrice + 1).fill(Infinity));
    const rating = Array.from({ length: n + 1 }, () => Array(targetPrice + 1).fill(-Infinity));
    
    dp[0][0] = 0; // No cost for zero books
    rating[0][0] = 0; // No rating for zero books

    for (let i = 1; i <= n; i++) {
        const price = books[i - 1].price * 100;
        const bookRating = books[i - 1].rating;
        for (let j = 0; j <= targetPrice; j++) {
            // If we do not pick the book
            dp[i][j] = dp[i - 1][j];
            rating[i][j] = rating[i - 1][j];

            // If we pick the book
            if (j >= price) {
                const newPrice = dp[i - 1][j - price] + price;
                const newRating = rating[i - 1][j - price] + bookRating;
                if (newPrice < dp[i][j] || (newPrice === dp[i][j] && newRating > rating[i][j])) {
                    dp[i][j] = newPrice;
                    rating[i][j] = newRating;
                }
            }
        }
    }

    // Find the maximum rating within the target price
    let resPrice = targetPrice;
    while (resPrice >= 0 && dp[n][resPrice] === Infinity) {
        resPrice--;
    }

    let selectedBooks = [];
    for (let i = n, j = resPrice; i > 0 && j > 0; i--) {
        const price = books[i - 1].price * 100;
        const bookRating = books[i - 1].rating;
        if (j >= price && dp[i][j] === dp[i - 1][j - price] + price && rating[i][j] === rating[i - 1][j - price] + bookRating) {
            selectedBooks.push(books[i - 1]);
            j -= price;
        }
    }

    selectedBooks.reverse(); // Reverse to maintain original order

    document.getElementById('result').innerHTML = `
        <h2>Optimization Results:</h2>
        <ul>
            ${selectedBooks.map(book => `
                <li>
                    <strong>Title:</strong> ${book.title}<br>
                    <strong>Rating:</strong> ${book.rating}<br>
                    <strong>Price:</strong> $${book.price.toFixed(2)}
                </li>`).join('')}
        </ul>
        <h3>Total Price: $${(dp[n][resPrice] / 100).toFixed(2)}</h3>
        <h2>Number of Books: ${selectedBooks.length}</h2>
    `;
}



//      Rekomendasi Buku
// Fungsi untuk menampilkan rekomendasi buku berdasarkan kategori dan rating
function recommendBook() {
    const category = document.getElementById('category').value;
    let filteredBooks = books;
    if (category !== 'All') {
        filteredBooks = books.filter(book => book.category === category);
    }
    filteredBooks.sort((a, b) => b.rating - a.rating);
    
    const recommendedBookList = document.getElementById('recommendedBookList');
    recommendedBookList.innerHTML = '';
    
    filteredBooks.forEach(book => {
        recommendedBookList.innerHTML += `<div class="book">
            <h2>${book.title}</h2>
            <p>Category: ${book.category}</p>
            <p>Rating: ${'*'.repeat(book.rating)}</p>
            <p>Price: $${book.price}</p>
            <p>Stock: ${book.stock}</p>
        </div>`;
    });
}

// Menampilkan rekomendasi ketika kategori berubah
document.addEventListener('DOMContentLoaded', function() {
    recommendBook();
});