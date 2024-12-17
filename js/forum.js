     // Initialize localStorage for forum data if not exists
       // Initialize localStorage for forum data if not exists
       const currentUser = localStorage.getItem('currentUser') ? 
       JSON.parse(localStorage.getItem('currentUser')) : 
       null;
       
       // Redirect to login if no user is logged in
       if (!currentUser) {
       window.location.href = 'index.html';
       }
       
       const forumPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
       
       // Rest of your existing script remains the same...
               // DOM Elements
               const newPostBtn = document.getElementById('newPostBtn');
               const newPostModal = document.getElementById('newPostModal');
               const newPostForm = document.getElementById('newPostForm');
               const cancelPostBtn = document.getElementById('cancelPostBtn');
               const forumPostsGrid = document.getElementById('forumPostsGrid');
               const postDetailsModal = document.getElementById('postDetailsModal');
               const postDetailsContent = document.getElementById('postDetailsContent');
               const closePostDetailsBtn = document.getElementById('closePostDetailsBtn');
               const addCommentBtn = document.getElementById('addCommentBtn');
               const addCommentModal = document.getElementById('addCommentModal');
               const addCommentForm = document.getElementById('addCommentForm');
               const cancelCommentBtn = document.getElementById('cancelCommentBtn');
               const searchPosts = document.getElementById('searchPosts');
               const categoryFilter = document.getElementById('categoryFilter');
               const backLibraryBtn = document.getElementById('backLibraryBtn');
               document.addEventListener('DOMContentLoaded', () => {
                // Get modal and button elements
                const addCommentBtn = document.getElementById('addCommentBtn');
                const addCommentModal = document.getElementById('addCommentModal');
                const cancelCommentBtn = document.getElementById('cancelCommentBtn');
                const addCommentForm = document.getElementById('addCommentForm');
                const commentText = document.getElementById('commentText');
                const postDetailsContent = document.getElementById('postDetailsContent');
            
                // Function to open comment modal
                function openCommentModal() {
                    addCommentModal.classList.remove('hidden');
                    addCommentModal.classList.add('flex');
                }
            
                // Function to close comment modal
                function closeCommentModal() {
                    addCommentModal.classList.remove('flex');
                    addCommentModal.classList.add('hidden');
                    commentText.value = ''; // Clear textarea
                }
            
                // Function to add comment to post details
                function addCommentToPost(comment) {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add(
                        'bg-gray-100', 
                        'p-4', 
                        'rounded-lg', 
                        'mb-4', 
                        'animate-fade-in'
                    );
                    commentElement.innerHTML = `
                        <div class="flex justify-between items-center mb-2">
                            <div class="font-semibold text-gray-800">Usuário Anônimo</div>
                            <div class="text-sm text-gray-500">${new Date().toLocaleString()}</div>
                        </div>
                        <p class="text-gray-700">${comment}</p>
                    `;
                    
                    postDetailsContent.appendChild(commentElement);
                    
                    // Scroll to the bottom of the content
                    postDetailsContent.scrollTop = postDetailsContent.scrollHeight;
                }
            
                // Event listener for opening comment modal
                addCommentBtn.addEventListener('click', openCommentModal);
            
                // Event listener for canceling comment
                cancelCommentBtn.addEventListener('click', closeCommentModal);
            
                // Event listener for submitting comment
                addCommentForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    // Get the comment text
                    const comment = commentText.value.trim();
                    
                    if (comment) {
                        // Add comment to post details
                        addCommentToPost(comment);
                        
                        // Close the modal
                        closeCommentModal();
                        
                        // Optional: Success message
                        alert('Comentário adicionado com sucesso!');
                    } else {
                        alert('Por favor, escreva um comentário antes de enviar.');
                    }
                });
            
                // Optional: Close modal if clicking outside the modal content
                addCommentModal.addEventListener('click', (e) => {
                    if (e.target === addCommentModal) {
                        closeCommentModal();
                    }
                });
            });
       
               // Open New Post Modal
               newPostBtn.addEventListener('click', () => {
                   if (!currentUser.email) {
                       alert('Faça login para criar uma discussão');
                       return;
                   }
                   newPostModal.classList.remove('hidden');
               });
       
               // Close New Post Modal
               cancelPostBtn.addEventListener('click', () => {
                   newPostModal.classList.add('hidden');
                   newPostForm.reset();
               });
       
               // Create New Post
               newPostForm.addEventListener('submit', (e) => {
                   e.preventDefault();
                   
                   const title = document.getElementById('postTitle').value;
                   const category = document.getElementById('postCategory').value;
                   const description = document.getElementById('postDescription').value;
                   const imageInput = document.getElementById('postImage');
       
                   // Generate unique post ID
                   const postId = Date.now();
       
                   // Handle image upload
                   let imageUrl = '';
                   if (imageInput.files.length > 0) {
                       const reader = new FileReader();
                       reader.onloadend = () => {
                           imageUrl = reader.result;
                           createPost(postId, title, category, description, imageUrl);
                       };
                       reader.readAsDataURL(imageInput.files[0]);
                   } else {
                       createPost(postId, title, category, description, imageUrl);
                   }
               });
       
               function createPost(postId, title, category, description, imageUrl) {
                   const newPost = {
                       id: postId,
                       title: title,
                       category: category,
                       description: description,
                       image: imageUrl,
                       author: currentUser.name || currentUser.email,
                       authorEmail: currentUser.email,
                       date: new Date().toLocaleDateString('pt-BR'),
                       comments: []
                   };
       
                   forumPosts.unshift(newPost);
                   localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
       
                   newPostModal.classList.add('hidden');
                   newPostForm.reset();
                   renderForumPosts();
               }
       // Continue the script tag from the HTML...
       
               // Render Forum Posts
               function renderForumPosts() {
                   const searchTerm = searchPosts.value.toLowerCase();
                   const categoryFilterValue = categoryFilter.value;
       
                   const filteredPosts = forumPosts.filter(post => 
                       (searchTerm === '' || 
                           post.title.toLowerCase().includes(searchTerm) || 
                           post.description.toLowerCase().includes(searchTerm)) &&
                       (categoryFilterValue === '' || post.category === categoryFilterValue)
                   );
       
                   forumPostsGrid.innerHTML = filteredPosts.map(post => `
                       <div class="bg-white rounded-xl shadow-md p-6 forum-post cursor-pointer" data-post-id="${post.id}">
                           <div class="flex justify-between items-center mb-4">
                               <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs uppercase">
                                   ${post.category.replace('-', ' ')}
                               </span>
                               <span class="text-gray-500 text-sm">${post.date}</span>
                           </div>
                           ${post.image ? `<img src="${post.image}" class="w-full h-48 object-cover rounded-lg mb-4">` : ''}
                           <h3 class="text-xl font-bold text-gray-800 mb-2">${post.title}</h3>
                           <p class="text-gray-600 mb-4 line-clamp-3">${post.description}</p>
                           <div class="flex justify-between items-center">
                               <div class="flex items-center space-x-2">
                                   <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                                       ${post.author.charAt(0).toUpperCase()}
                                   </div>
                                   <span class="text-gray-700">${post.author}</span>
                               </div>
                               <div class="flex items-center space-x-2">
                                   <i class="fas fa-comment text-gray-400"></i>
                                   <span class="text-gray-600">${post.comments.length}</span>
                               </div>
                           </div>
                       </div>
                   `).join('');
       
                   // Add click event listeners to forum posts
                   document.querySelectorAll('.forum-post').forEach(post => {
                       post.addEventListener('click', () => showPostDetails(post.dataset.postId));
                   });
               }
       
               // Show Post Details
               function showPostDetails(postId) {
                   const post = forumPosts.find(p => p.id.toString() === postId);
                   if (!post) return;
       
                   postDetailsContent.innerHTML = `
                       <div class="mb-8">
                           <div class="flex justify-between items-center mb-6">
                               <span class="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm uppercase">
                                   ${post.category.replace('-', ' ')}
                               </span>
                               <span class="text-gray-500">${post.date}</span>
                           </div>
                           ${post.image ? `<img src="${post.image}" class="w-full max-h-96 object-cover rounded-xl mb-6">` : ''}
                           <h2 class="text-3xl font-bold text-gray-800 mb-4">${post.title}</h2>
                           <p class="text-gray-600 mb-6 whitespace-pre-wrap">${post.description}</p>
                           <div class="flex items-center space-x-3">
                               <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-lg">
                                   ${post.author.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                   <div class="font-semibold text-gray-800">${post.author}</div>
                                   <div class="text-gray-500 text-sm">Autor da discussão</div>
                               </div>
                           </div>
                       </div>
                       <div class="border-t border-gray-200 pt-8">
                           <h3 class="text-2xl font-bold text-gray-800 mb-6">Comentários (${post.comments.length})</h3>
                           <div class="space-y-6">
                               ${post.comments.map(comment => `
                                   <div class="bg-gray-50 rounded-lg p-6">
                                       <div class="flex items-center space-x-3 mb-4">
                                           <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                                               ${comment.author.charAt(0).toUpperCase()}
                                           </div>
                                           <div>
                                               <div class="font-semibold text-gray-800">${comment.author}</div>
                                               <div class="text-gray-500 text-sm">${comment.date}</div>
                                           </div>
                                       </div>
                                       <p class="text-gray-600 whitespace-pre-wrap">${comment.text}</p>
                                   </div>
                               `).join('')}
                           </div>
                       </div>
                   `;
       
                   postDetailsModal.classList.remove('hidden');
                   currentPostId = postId;
               }
       
               // Close Post Details Modal
               closePostDetailsBtn.addEventListener('click', () => {
                   postDetailsModal.classList.add('hidden');
                   currentPostId = null;
               });
       
               // Handle Comments
               let currentPostId = null;
       
               addCommentBtn.addEventListener('click', () => {
                   if (!currentUser.email) {
                       alert('Faça login para comentar');
                       return;
                   }
                   addCommentModal.classList.remove('hidden');
               });
       
               cancelCommentBtn.addEventListener('click', () => {
                   addCommentModal.classList.add('hidden');
                   addCommentForm.reset();
               });
       
               addCommentForm.addEventListener('submit', (e) => {
                   e.preventDefault();
                   
                   const postDetailsContent = document.getElementById('postDetailsContent');
postDetailsContent.innerHTML = "<p>Seu conteúdo longo aqui...</p>"; // Exemplo de conteúdo dinâmico

                   const commentText = document.getElementById('commentText').value;
                   const postIndex = forumPosts.findIndex(p => p.id.toString() === currentPostId);
                   
                   if (postIndex === -1) return;
       
                   const newComment = {
                       id: Date.now(),
                       text: commentText,
                       author: currentUser.name || currentUser.email,
                       authorEmail: currentUser.email,
                       date: new Date().toLocaleDateString('pt-BR')
                   };
       
                   forumPosts[postIndex].comments.push(newComment);
                   localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
       
                   addCommentModal.classList.add('hidden');
                   addCommentForm.reset();
                   showPostDetails(currentPostId);
                   renderForumPosts();
               });
       
               // Search and Filter
               searchPosts.addEventListener('input', renderForumPosts);
               categoryFilter.addEventListener('change', renderForumPosts);
       
               // Back to Library Button
               backLibraryBtn.addEventListener('click', () => {
                   window.location.href = 'biblioteca.html';
               });
       
               // Initial render
               renderForumPosts();
       
               // Close modals when clicking outside
               [newPostModal, postDetailsModal, addCommentModal].forEach(modal => {
                   modal.addEventListener('click', (e) => {
                       if (e.target === modal) {
                           modal.classList.add('hidden');
                           if (modal === newPostModal) newPostForm.reset();
                           if (modal === addCommentModal) addCommentForm.reset();
                       }
                   });
               });

               
               