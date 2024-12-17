     // Redirecionar para as páginas correspondentes
     document.getElementById('forumBtn').addEventListener('click', function() {
        window.location.href = 'forum.html';
    });

    document.getElementById('metasBtn').addEventListener('click', function() {
        window.location.href = 'meta.html';
    });

    document.getElementById('adminBtn').addEventListener('click', function() {
        window.location.href = 'admin.html';
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        alert('Você foi desconectado!');
        // Adicione o redirecionamento para a página de login, se necessário
        window.location.href = 'index.html';
    });
        // Paste the entire previous script here (it remains exactly the same)
        const books = JSON.parse(localStorage.getItem('entrelinhasBooks') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const userLibrary = JSON.parse(localStorage.getItem('userLibrary') || '{}');

        // Ensure user's library exists
        if (!userLibrary[currentUser.email]) {
            userLibrary[currentUser.email] = {
                lendo: [],
                lidos: [],
                queroLer: [],
                favoritos: []
            };
        }

        // Tab Navigation
        const tabButtons = document.querySelectorAll('.tab-btn');
        const bookGrid = document.getElementById('bookGrid');
        const searchInput = document.getElementById('searchInput');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active state from all tabs
                tabButtons.forEach(btn => btn.classList.remove('tab-active'));
                
                // Add active state to clicked tab
                button.classList.add('tab-active');
                
                // Render books based on selected tab
                const tab = button.dataset.tab;
                renderBooks(tab);
            });
        });

        // Render Books
        function renderBooks(tab = 'todosLivros') {
            let displayBooks = [];

            if (tab === 'todosLivros') {
                displayBooks = books;
            } else {
                // Get books from user's specific shelf
                displayBooks = userLibrary[currentUser.email][tab] || [];
            }

            // Filter by search input
            const searchTerm = searchInput.value.toLowerCase();
            displayBooks = displayBooks.filter(book => 
                book.title.toLowerCase().includes(searchTerm) || 
                book.author.toLowerCase().includes(searchTerm)
            );

            bookGrid.innerHTML = displayBooks.map(book => `
                <div class="bg-white rounded-xl overflow-hidden shadow-md book-card relative" data-id="${book.id}">
                    <img src="${book.cover}" alt="${book.title}" class="w-full h-64 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-bold truncate text-gray-800">${book.title}</h3>
                        <p class="text-gray-600 text-sm mb-4">${book.author}</p>
                        <div class="shelf-buttons absolute bottom-4 left-4 right-4 justify-between">
                            <button onclick="moveBook('lendo', ${book.id})" class="shelf-button bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs shadow-md">Lendo</button>
                            <button onclick="moveBook('lidos', ${book.id})" class="shelf-button bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs shadow-md">Lido</button>
                            <button onclick="moveBook('queroLer', ${book.id})" class="shelf-button bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs shadow-md">Quero Ler</button>
                            <button onclick="moveBook('favoritos', ${book.id})" class="shelf-button bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs shadow-md">Favorito</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Add click event to show book details
            document.querySelectorAll('.book-card').forEach(card => {
                card.addEventListener('click', () => showBookDetails(card.dataset.id));
            });
        }

        // Move Book Between Shelves
        function moveBook(shelf, bookId) {
            const book = books.find(b => b.id == bookId);
            const userEmail = currentUser.email;

            // Remove book from all other shelves
            const shelves = ['lendo', 'lidos', 'queroLer', 'favoritos'];
            shelves.forEach(s => {
                if (userLibrary[userEmail][s]) {
                    userLibrary[userEmail][s] = userLibrary[userEmail][s].filter(b => b.id !== bookId);
                }
            });

            // Add to selected shelf
            if (!userLibrary[userEmail][shelf]) {
                userLibrary[userEmail][shelf] = [];
            }

            // Prevent duplicates
            if (!userLibrary[userEmail][shelf].some(b => b.id === bookId)) {
                userLibrary[userEmail][shelf].push(book);
            }

            // Save to localStorage
            localStorage.setItem('userLibrary', JSON.stringify(userLibrary));

            // Re-render current tab
            const activeTab = document.querySelector('.tab-btn.tab-active').dataset.tab;
            renderBooks(activeTab);

            alert(`Livro movido para: ${shelf}`);
        }

        // Show Book Details
        function showBookDetails(bookId) {
            const book = books.find(b => b.id == bookId);
            const modal = document.getElementById('bookModal');
            const modalContent = document.getElementById('bookModalContent');

            modalContent.innerHTML = `
                <div class="flex space-x-8">
                    <img src="${book.cover}" alt="${book.title}" class="w-1/3 rounded-xl shadow-lg object-cover">
                    <div>
                        <h2 class="text-3xl font-bold mb-4 text-gray-800">${book.title}</h2>
                        <p class="text-gray-600 mb-2 text-lg"><strong>Autor:</strong> ${book.author}</p>
                        <p class="text-gray-600 mb-4 text-lg"><strong>Gênero:</strong> ${book.genre}</p>
                        <p class="text-gray-800 leading-relaxed">${book.description}</p>
                    </div>
                </div>
            `;

            modal.classList.remove('hidden');
        }

        // Close Modal
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('bookModal').classList.add('hidden');
        });

        // Search Functionality
        searchInput.addEventListener('input', () => {
            const activeTab = document.querySelector('.tab-btn.tab-active').dataset.tab;
            renderBooks(activeTab);
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });

        // Initial Render
        renderBooks();