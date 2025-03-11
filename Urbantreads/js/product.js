// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    loadCart();
    
    // Initialize products
    initProducts();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize filters
    initFilters();
    
    // Initialize sort options
    initSortOptions();
    
    // Initialize quick view
    initQuickView();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize user menu
    initUserMenu();
});

// Products data
const products = [
    {
        id: 1,
        name: 'Air Jordan 1 Retro High OG',
        brand: 'Jordan',
        price: 179.99,
        image: '../assets/product-1.jpg',
        category: 'Basketball',
        condition: 'New',
        description: 'The Air Jordan 1 Retro High OG features a genuine leather upper, Nike Air cushioning and an encapsulated Air-Sole unit for lightweight cushioning.',
        styleCode: '555088-123',
        colorway: 'White/Black-Red',
        releaseDate: '2022-05-15',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 2,
        name: 'Yeezy Boost 350 V2',
        brand: 'Adidas',
        price: 249.99,
        image: '../assets/product-2.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The Yeezy Boost 350 V2 features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper. Reflective threads are woven into the laces. The midsole utilizes adidas innovative BOOST™ technology.',
        styleCode: 'FZ5000',
        colorway: 'Grey/Core Black/Red',
        releaseDate: '2022-02-10',
        sizes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 3,
        name: 'Nike Dunk Low',
        brand: 'Nike',
        price: 129.99,
        image: '../assets/product-3.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The Nike Dunk Low features a low-cut silhouette that combines comfort and style. The padded, low-cut collar allows a full range of motion, while the rubber outsole provides excellent traction.',
        styleCode: 'DD1391-100',
        colorway: 'White/Black',
        releaseDate: '2021-11-05',
        sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
        id: 4,
        name: 'New Balance 550',
        brand: 'New Balance',
        price: 119.99,
        image: '../assets/product-4.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The New Balance 550 is a retro basketball silhouette brought back from the archives. Features a leather upper with perforated details and a cupsole for comfort and durability.',
        styleCode: 'BB550WT1',
        colorway: 'White/Green',
        releaseDate: '2022-03-01',
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 5,
        name: 'Air Jordan 4 Retro',
        brand: 'Jordan',
        price: 209.99,
        image: '../assets/product-5.jpg',
        category: 'Basketball',
        condition: 'New',
        description: 'The Air Jordan 4 Retro features a premium leather upper with the iconic visible Air cushioning in the heel for responsive comfort.',
        styleCode: 'CT8527-100',
        colorway: 'White/Fire Red-Black-Tech Grey',
        releaseDate: '2022-04-20',
        sizes: [7, 8, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 6,
        name: 'Adidas Forum Low',
        brand: 'Adidas',
        price: 99.99,
        image: '../assets/product-6.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The adidas Forum Low is a basketball-inspired shoe made with a leather upper and signature ankle strap for a secure fit.',
        styleCode: 'FY7755',
        colorway: 'Cloud White/Blue',
        releaseDate: '2021-09-15',
        sizes: [7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 7,
        name: 'Nike Air Force 1 Low',
        brand: 'Nike',
        price: 109.99,
        image: '../assets/product-7.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The Nike Air Force 1 Low is a modern take on the iconic basketball shoe that combines court style with off-court attitude.',
        styleCode: '315122-111',
        colorway: 'White/White',
        releaseDate: '2020-01-01',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 8,
        name: 'Puma Suede Classic',
        brand: 'Puma',
        price: 79.99,
        image: '../assets/product-8.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The Puma Suede Classic features a soft suede upper with the iconic Puma Formstrip and a rubber outsole for excellent traction.',
        styleCode: '352634-03',
        colorway: 'Black/White',
        releaseDate: '2020-05-10',
        sizes: [7, 8, 9, 10, 11, 12]
    }
];

// Initialize products
function initProducts() {
    renderProducts(products);
}

// Render products
function renderProducts(productsToRender) {
    const productGrid = document.getElementById('productGrid');
    const productCount = document.getElementById('productCount');
    
    if (!productGrid || !productCount) return;
    
    productCount.textContent = productsToRender.length;
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3">No products found</h3>
                <p class="text-muted">Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }
    
    let productsHTML = '';
    
    productsToRender.forEach(product => {
        productsHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="product-card">
                    <div class="position-relative">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <button class="btn btn-sm quick-view-btn" data-id="${product.id}">Quick View</button>
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${product.brand}</p>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <span class="badge bg-secondary">${product.category}</span>
                        </div>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = productsHTML;
    
    // Add event listeners to buttons
    addProductButtonListeners();
}

// Add event listeners to product buttons
function addProductButtonListeners() {
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                openQuickView(product);
            }
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                openQuickView(product);
            }
        });
    });
}

// Initialize navbar scroll effect
function initNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize filters
function initFilters() {
    // Filter state
    let filters = {
        brands: [],
        categories: [],
        maxPrice: 1000,
        size: null
    };
    
    // Brand filters
    document.querySelectorAll('.filter-brand').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.brands.push(this.value);
            } else {
                filters.brands = filters.brands.filter(brand => brand !== this.value);
            }
            applyFilters();
        });
    });
    
    // Category filters
    document.querySelectorAll('.filter-category').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.categories.push(this.value);
            } else {
                filters.categories = filters.categories.filter(category => category !== this.value);
            }
            applyFilters();
        });
    });
    
    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            filters.maxPrice = parseInt(this.value);
            priceValue.textContent = `$${filters.maxPrice}`;
            applyFilters();
        });
    }
    
    // Size filters
    document.querySelectorAll('.size-btn').forEach(button => {
        button.addEventListener('click', function() {
            const size = parseFloat(this.getAttribute('data-size'));
            
            // Toggle active class
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                filters.size = null;
            } else {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                filters.size = size;
            }
            
            applyFilters();
        });
    });
    
    // Clear all filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset filter state
            filters = {
                brands: [],
                categories: [],
                maxPrice: 1000,
                size: null
            };
            
            // Reset UI
            document.querySelectorAll('.filter-brand, .filter-category').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            if (priceRange) {
                priceRange.value = 500;
                priceValue.textContent = '$500';
            }
            
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Render all products
            renderProducts(products);
        });
    }
    
    // Apply filters function
    function applyFilters() {
        let filteredProducts = [...products];
        
        // Filter by brand
        if (filters.brands.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                filters.brands.includes(product.brand)
            );
        }
        
        // Filter by category
        if (filters.categories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                filters.categories.includes(product.category)
            );
        }
        
        // Filter by price
        filteredProducts = filteredProducts.filter(product => 
            product.price <= filters.maxPrice
        );
        
        // Filter by size
        if (filters.size) {
            filteredProducts = filteredProducts.filter(product => 
                product.sizes.includes(filters.size)
            );
        }
        
        // Render filtered products
        renderProducts(filteredProducts);
    }
}

// Initialize sort options
function initSortOptions() {
    const sortOptions = document.getElementById('sortOptions');
    if (!sortOptions) return;
    
    sortOptions.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedProducts = [...products];
        
        switch (sortValue) {
            case 'priceAsc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            // Default is 'featured', no sorting needed
        }
        
        renderProducts(sortedProducts);
    });
}

// Initialize quick view
function initQuickView() {
    // Initialize the modal
    const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    
    // Add to cart button in quick view
    const quickViewAddToCart = document.getElementById('quickViewAddToCart');
    if (quickViewAddToCart) {
        quickViewAddToCart.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                // Get selected size
                const selectedSize = document.querySelector('#quickViewSizes .size-btn.active');
                if (!selectedSize) {
                    showNotification('Please select a size', 'error');
                    return;
                }
                
                const size = parseFloat(selectedSize.getAttribute('data-size'));
                
                // Add to cart
                addToCart(product, size);
                
                // Close modal
                quickViewModal.hide();
            }
        });
    }
}

// Open quick view modal
function openQuickView(product) {
    // Fill modal with product details
    document.getElementById('quickViewTitle').textContent = product.name;
    document.getElementById('quickViewName').textContent = product.name;
    document.getElementById('quickViewBrand').textContent = product.brand;
    document.getElementById('quickViewPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('quickViewCondition').textContent = product.condition;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewMainImage').src = product.image;
    document.getElementById('quickViewStyleCode').textContent = product.styleCode;
    document.getElementById('quickViewColorway').textContent = product.colorway;
    document.getElementById('quickViewReleaseDate').textContent = product.releaseDate;
    
    // Set product ID on add to cart button
    document.getElementById('quickViewAddToCart').setAttribute('data-product-id', product.id);
    
    // Render sizes
    const sizesContainer = document.getElementById('quickViewSizes');
    let sizesHTML = '';
    
    product.sizes.forEach(size => {
        sizesHTML += `<button class="size-btn" data-size="${size}">${size}</button>`;
    });
    
    sizesContainer.innerHTML = sizesHTML;
    
    // Add event listeners to size buttons
    document.querySelectorAll('#quickViewSizes .size-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#quickViewSizes .size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Show modal
    const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    quickViewModal.show();
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');
    
    if (!searchInput || !searchBtn || !searchResultsDropdown) return;
    
    // Search function
    function performSearch(query) {
        if (!query) {
            searchResultsDropdown.classList.remove('show');
            return;
        }
        
        // Convert query to lowercase for case-insensitive search
        query = query.toLowerCase();
        
        // Filter products based on search query
        const results = products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
        
        // Render search results
        if (results.length === 0) {
            searchResultsDropdown.innerHTML = `
                <div class="search-message">No results found for "${query}"</div>
            `;
        } else {
            let resultsHTML = '';
            
            results.forEach(product => {
                resultsHTML += `
                    <a href="product.html?id=${product.id}" class="search-result-item">
                        <img src="${product.image}" alt="${product.name}" class="search-result-img">
                        <div class="search-result-info">
                            <div class="search-result-title">${product.name}</div>
                            <div class="search-result-brand">${product.brand} | ${product.category}</div>
                        </div>
                        <div class="search-result-price">$${product.price.toFixed(2)}</div>
                    </a>
                `;
            });
            
            searchResultsDropdown.innerHTML = resultsHTML;
        }
        
        // Show dropdown
        searchResultsDropdown.classList.add('show');
    }
    
    // Event listeners
    searchInput.addEventListener('input', function() {
        performSearch(this.value.trim());
    });
    
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value.trim());
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchBtn.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
            searchResultsDropdown.classList.remove('show');
        }
    });
    
    // Prevent dropdown from closing when clicking inside it
    searchResultsDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Handle Enter key press
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value.trim());
        }
    });
}

// Initialize user menu
function initUserMenu() {
    const user = JSON.parse(localStorage.getItem('user'));
    const userLoggedInElement = document.querySelector('.user-logged-in');
    const userNotLoggedInElement = document.querySelector('.user-not-logged-in');
    const userNameElement = document.querySelector('.user-name');
    const userAvatarElement = document.querySelector('.user-avatar');
    
    if (user && user.isLoggedIn) {
        // Show logged in menu
        if (userLoggedInElement) userLoggedInElement.classList.remove('d-none');
        if (userNotLoggedInElement) userNotLoggedInElement.classList.add('d-none');
        
        // Update user name and avatar
        if (userNameElement) userNameElement.textContent = user.name || 'User';
        if (userAvatarElement && user.avatar) userAvatarElement.src = user.avatar;
    } else {
        // Show not logged in menu
        if (userLoggedInElement) userLoggedInElement.classList.add('d-none');
        if (userNotLoggedInElement) userNotLoggedInElement.classList.remove('d-none');
    }
    
    // Handle logout button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('user');
            
            // Show success message
            showNotification('Logged out successfully');
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1500);
        });
    }
}

// Cart functionality
let cart = [];

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(product, size = null, quantity = 1) {
    // Check if product already exists in cart with same size
    const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === size
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity if product already exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    if (!cartCount || !cartItems) return;
    
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart dropdown
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center empty-cart-message">Your cart is empty</p>';
        if (cartSummary) cartSummary.classList.add('d-none');
        if (emptyCartMessage) emptyCartMessage.classList.remove('d-none');
    } else {
        let cartItemsHTML = '';
        
        cart.forEach((item, index) => {
            cartItemsHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h6 class="cart-item-title">${item.name}</h6>
                        <div class="d-flex justify-content-between">
                            <div>
                                ${item.size ? `<small>Size: ${item.size}</small><br>` : ''}
                                <small>Qty: ${item.quantity}</small>
                            </div>
                            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartItemsHTML;
        if (cartSummary) cartSummary.classList.remove('d-none');
        if (emptyCartMessage) emptyCartMessage.classList.add('d-none');
        
        // Update cart total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}