// Simulação de dados de livros cadastrados
const books = [
    { title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', cover: 'https://placekitten.com/200/300', id: 1 },
    { title: '1984', author: 'George Orwell', cover: 'https://placekitten.com/200/301', id: 2 },
    { title: 'Harry Potter e a Pedra Filosofal', author: 'J.K. Rowling', cover: 'https://placekitten.com/200/302', id: 3 },
    { title: 'O Hobbit', author: 'J.R.R. Tolkien', cover: 'https://placekitten.com/200/303', id: 4 },
    { title: 'Dom Casmurro', author: 'Machado de Assis', cover: 'https://placekitten.com/200/304', id: 5 },
];

let selectedBooks = [];
let booksRead = 0;
let totalBooks = books.length;
let totalTime = 0;

// Exibe os livros cadastrados
function loadBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';

    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button onclick="toggleBookSelection(${book.id})">Selecionar para ler</button>
        `;
        bookList.appendChild(bookItem);
    });
}

// Pesquisa de livros
function searchBooks() {
    const searchValue = document.getElementById('search').value.toLowerCase();
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchValue) || 
        book.author.toLowerCase().includes(searchValue)
    );
    
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `
            <img src="${book.cover}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <button onclick="toggleBookSelection(${book.id})">Selecionar para ler</button>
        `;
        bookList.appendChild(bookItem);
    });
}

// Marca ou desmarca um livro
function toggleBookSelection(bookId) {
    const book = books.find(b => b.id === bookId);
    const index = selectedBooks.indexOf(book);

    if (index === -1) {
        selectedBooks.push(book);
    } else {
        selectedBooks.splice(index, 1);
    }

    updateProgress();
}

// Inicia a meta de leitura com o tempo selecionado
function startReading() {
    const time = document.getElementById('reading-time').value;

    if (!time || time < 1) {
        alert("Por favor, insira um tempo válido.");
        return;
    }

    totalTime = time;
    booksRead = 0;
    updateProgress();
}

// Atualiza o progresso de leitura
function updateProgress() {
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress');
    const progressPercent = (booksRead / selectedBooks.length) * 100;

    progressBar.style.width = `${progressPercent}%`;
    progressText.innerText = `Progresso: ${Math.round(progressPercent)}%`;

    // Atualiza a barra de progresso e o texto
    if (booksRead === selectedBooks.length) {
        alert("Você completou a sua meta de leitura! Parabéns!");
    }
}

// Função para marcar livro como lido
function markAsRead(bookId) {
    booksRead++;
    updateProgress();
}

// Carregar os livros ao iniciar
loadBooks();