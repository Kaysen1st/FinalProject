document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    loadCart();
    
    // Initialize featured products
    initFeaturedProducts();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize user menu
    initUserMenu();
    
});

// Featured products data
const featuredProducts = [
    {
        id: 1,
        name: 'Kobe 6 Protro Sail',
        brand: 'Nike',
        price: 165.88,
        image: '/Assests/Nike/Basketball/Mens/KB6/kb6.jpg'
    },
    {
        id: 2,
        name: 'Adidas Originals Handball Spezial',
        brand: 'Adidas',
        price: 100.00,
        image: '/Assests/Adidas/Lifestyle/Womens/AHS/ahs.png'
    },
    {
        id: 3,
        name: 'Nike SB Zoom Blazer Mid x Antihero',
        brand: 'Nike',
        price: 108.23 ,
        image: '/Assests/Nike/Lifestyle/Mens/SBZB/sbzb.jpg'
    },
    {
        id: 4,
        name: 'Anthony Edwards 1 Low',
        brand: 'Adidas',
        price: 119.99,
        image: '/Assests/Adidas/Basketball/Mens/AE1/ae1.png'
    }
];

// Initialize featured products section
function initFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (!featuredProductsContainer) return;
    
    let productsHTML = '';
    
    featuredProducts.forEach(product => {
        productsHTML += `
            <div class="col-md-6 col-lg-3">
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-brand">${product.brand}</p>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    featuredProductsContainer.innerHTML = productsHTML;
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = featuredProducts.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
            }
        });
    });
}

// Initialize navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Add active class to current page link
    const currentPath = window.location.pathname;
    const navLinks = navbar.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || 
            (currentPath.endsWith('/') && href === currentPath.slice(0, -1)) ||
            (!currentPath.endsWith('/') && href === currentPath + '/')) {
            link.classList.add('active');
        }
    });

    // Add scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize newsletter form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        
        if (emailInput.value.trim()) {
            showNotification('Thanks for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');
    
    if (!searchInput || !searchBtn || !searchResultsDropdown) return;
    
    // Sample products data for search
    const products = [
        {
            id: 1,
            name: 'Kobe 6 Protro',
            brand: 'Nike',
            price: 165.88,
            image: '/Assests/Nike/Basketball/Mens/KB6/kb6.jpg',
            category: 'Basketball',
        },
        {
            id: 7,
            name: 'Nike Air Force 1 Low',
            brand: 'Nike',
            price: 129.99,
            image: '/Assests/Nike/Lifestyle/Mens/AF1L/af1l.jpg',
            category: 'Lifestyle',
        },
        {
            id: 20,
            name: 'UGG Classic Short II',
            brand: 'Deckers Brands',
            price: 180.00,
            image: '/Assests/DeckerBrands/Lifestyle/UGGC/uggc.png',
            category: 'Lifestyle',
        },
        {
            id: 14,
            name: 'Adidas Originals Campus 00s',
            brand: 'Adidas',
            price: 110.00,
            image: '/Assests/Adidas/Lifestyle/Womens/AC/ac.png',
            category: 'Lifestyle',
        },
        {
            id: 16,
            name: 'Adidas Lightshift',
            brand: 'Adidas',
            price: 100.00,
            image: '/Assests/Adidas/Running/Mens/ALS/als.png',
            category: 'Running',
        },
        {
            id: 5,
            name: 'Air Pegasus Wave Premium',
            brand: 'Nike',
            price: 155.40,
            image: '/Assests/Nike/Running/Mens/apgw/apgw.jpg',
            category: 'Running',
        },
        {
            id: 18,
            name: 'Anthony Edwards 1 "Iron Sharpens Iron" ',
            brand: 'Adidas',
            price: 139.76,
            image: '/Assests/Adidas/Basketball/Mens/AE1/ae1.png',
            category: 'Basketball',
        },
        {
            id: 21,
            name: 'HOKA Clifton 9 ',
            brand: 'Deckers Brands',
            price: 145.00,
            image: '/Assests/DeckerBrands/Running/HC9/hc9.png',
            category: 'Running',
        }
    ];
    
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
        
        cart.forEach((item) => {
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
// Function to show sale popup banner
function showSaleBanner() {
    console.log("Showing sale banner");
    
    // Check if elements exist
    const popupOverlay = document.getElementById('popupOverlay');
    const salePopup = document.getElementById('salePopup');
    const closePopupBtn = document.getElementById('closePopup');
    
    if (!popupOverlay || !salePopup || !closePopupBtn) {
        console.error("Sale popup elements not found in the DOM");
        return;
    }
    
    // Show the popup and overlay
    popupOverlay.style.display = 'block';
    salePopup.style.display = 'block';
    
    // Function to close the popup
    function closePopup() {
        console.log("Closing popup");
        popupOverlay.style.display = 'none';
        salePopup.style.display = 'none';
    }
    
    // Add close functionality
    closePopupBtn.onclick = closePopup;
    
    // Close when clicking on overlay
    popupOverlay.onclick = closePopup;
}

// Check for user login status when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if user just logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.showSaleBanner) {
        console.log("User qualifies for sale banner");
        
        // Show banner after a short delay
        setTimeout(showSaleBanner, 1000);
        
        // Update user data to not show the banner again
        user.showSaleBanner = false;
        localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Ensure close button works even if added later
    document.body.addEventListener('click', function(e) {
        if (e.target.id === 'closePopup' || e.target.closest('#closePopup')) {
            console.log("Close button clicked");
            const popupOverlay = document.getElementById('popupOverlay');
            const salePopup = document.getElementById('salePopup');
            
            if (popupOverlay) popupOverlay.style.display = 'none';
            if (salePopup) salePopup.style.display = 'none';
        }
    });
});

// For testing - you can call this function from the browser console
function testSaleBanner() {
    showSaleBanner();
}