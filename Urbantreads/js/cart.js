// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    loadCart();
    
    // Initialize cart page UI
    initCartPage();
    
    // Initialize PayPal buttons
    initPayPalButtons();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize user menu
    initUserMenu();
});

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

// Initialize cart page
function initCartPage() {
    // Get relevant DOM elements
    const cartItemsList = document.getElementById('cartItemsList');
    const cartItemCount = document.getElementById('cartItemCount');
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderShipping = document.getElementById('orderShipping');
    const orderTax = document.getElementById('orderTax');
    const orderTotal = document.getElementById('orderTotal');
    const updateCartBtn = document.getElementById('updateCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const applyPromoBtn = document.getElementById('applyPromo');
    
    if (!cartItemsList) return; // Not on cart page
    
    // Render cart items
    renderCartItems();
    
    // Render recommended products
    renderRecommendedProducts();
    
    // Calculate and update order summary
    updateOrderSummary();
    
    // Add event listeners
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', updateCartQuantities);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            // In a real application, this would navigate to checkout
            // For this demo, we'll just scroll to the PayPal button
            document.getElementById('paypal-button-container').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    // Function to render cart items
    function renderCartItems() {
        if (cart.length === 0) {
            cartItemsList.innerHTML = `
                <div class="text-center py-5 empty-cart-message">
                    <i class="bi bi-cart-x display-1 text-muted"></i>
                    <h4 class="mt-3">Your cart is empty</h4>
                    <p class="text-muted">Looks like you haven't added anything to your cart yet.</p>
                    <a href="product.html" class="btn btn-primary mt-3">Browse Products</a>
                </div>
            `;
            
            cartItemCount.textContent = '0';
        } else {
            let itemsHTML = '';
            
            cart.forEach((item, index) => {
                itemsHTML += `
                    <div class="cart-item p-4 border-bottom">
                        <div class="row align-items-center">
                            <div class="col-md-2 col-4 mb-3 mb-md-0">
                                <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                            </div>
                            <div class="col-md-4 col-8 mb-3 mb-md-0">
                                <h5 class="mb-1">${item.name}</h5>
                                <p class="mb-1 text-muted">${item.brand}</p>
                                ${item.size ? `<p class="mb-0 badge bg-secondary">Size: ${item.size}</p>` : ''}
                            </div>
                            <div class="col-md-2 col-4">
                                <div class="quantity-control">
                                    <button class="quantity-btn" data-action="decrease" data-index="${index}">-</button>
                                    <input type="number" min="1" value="${item.quantity}" class="cart-item-quantity" data-index="${index}">
                                    <button class="quantity-btn" data-action="increase" data-index="${index}">+</button>
                                </div>
                            </div>
                            <div class="col-md-2 col-4 text-md-center">
                                <span class="fw-bold">$${item.price.toFixed(2)}</span>
                            </div>
                            <div class="col-md-2 col-4 text-md-end">
                                <span class="fw-bold">$${(item.price * item.quantity).toFixed(2)}</span>
                                <button class="btn btn-sm text-danger remove-item mt-2" data-index="${index}">
                                    <i class="bi bi-trash me-1"></i>Remove
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            cartItemsList.innerHTML = itemsHTML;
            cartItemCount.textContent = cart.length;
            
            // Add event listeners to cart item buttons
            addCartItemListeners();
        }
    }
    
    // Add event listeners to cart item buttons
    function addCartItemListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const action = this.getAttribute('data-action');
                const quantityInput = this.parentElement.querySelector('input');
                
                if (action === 'increase') {
                    quantityInput.value = parseInt(quantityInput.value) + 1;
                } else {
                    if (parseInt(quantityInput.value) > 1) {
                        quantityInput.value = parseInt(quantityInput.value) - 1;
                    }
                }
                
                // Update order summary
                updateOrderSummary();
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                
                // Remove item from cart
                cart.splice(index, 1);
                
                // Save and update
                saveCart();
                renderCartItems();
                updateOrderSummary();
                updateCartUI();
                
                showNotification('Item removed from cart');
            });
        });
        
        // Quantity input change
        document.querySelectorAll('.cart-item-quantity').forEach(input => {
            input.addEventListener('change', function() {
                // Ensure quantity is at least 1
                if (parseInt(this.value) < 1) {
                    this.value = 1;
                }
                
                // Update order summary
                updateOrderSummary();
            });
        });
    }
    
    // Update cart quantities from inputs
    function updateCartQuantities() {
        const quantityInputs = document.querySelectorAll('.cart-item-quantity');
        let updated = false;
        
        quantityInputs.forEach(input => {
            const index = parseInt(input.getAttribute('data-index'));
            const newQuantity = parseInt(input.value);
            
            if (cart[index].quantity !== newQuantity) {
                cart[index].quantity = newQuantity;
                updated = true;
            }
        });
        
        if (updated) {
            saveCart();
            updateOrderSummary();
            updateCartUI();
            showNotification('Cart updated successfully');
        }
    }
    
    // Calculate and update order summary
    function updateOrderSummary() {
        if (cart.length === 0) {
            orderSubtotal.textContent = '$0.00';
            orderShipping.textContent = '$0.00';
            orderTax.textContent = '$0.00';
            orderTotal.textContent = '$0.00';
            return;
        }
        
        // Calculate subtotal from current cart items and quantity inputs
        let subtotal = 0;
        const quantityInputs = document.querySelectorAll('.cart-item-quantity');
        
        quantityInputs.forEach(input => {
            const index = parseInt(input.getAttribute('data-index'));
            const quantity = parseInt(input.value);
            subtotal += cart[index].price * quantity;
        });
        
        // If no quantity inputs are found (e.g., cart was empty), calculate from cart
        if (quantityInputs.length === 0) {
            subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        const shipping = subtotal > 0 ? (subtotal >= 200 ? 0 : 9.99) : 0; // Free shipping over $200
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + tax;
        
        // Update order summary
        orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        orderShipping.textContent = `$${shipping.toFixed(2)}`;
        orderTax.textContent = `$${tax.toFixed(2)}`;
        orderTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Apply promo code
    function applyPromoCode() {
        const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();
        const promoMessage = document.getElementById('promoMessage');
        const discountRow = document.querySelector('.discount-row');
        const orderDiscount = document.getElementById('orderDiscount');
        
        // Check if promo code is valid
        if (promoCode === 'WELCOME10') {
            // Calculate 10% discount
            const subtotal = parseFloat(orderSubtotal.textContent.replace('$', ''));
            const discount = subtotal * 0.1;
            
            // Update UI
            promoMessage.classList.remove('d-none');
            discountRow.classList.remove('d-none');
            orderDiscount.textContent = `-$${discount.toFixed(2)}`;
            
            // Recalculate total
            const shipping = parseFloat(orderShipping.textContent.replace('$', ''));
            const tax = parseFloat(orderTax.textContent.replace('$', ''));
            const total = subtotal + shipping + tax - discount;
            orderTotal.textContent = `$${total.toFixed(2)}`;
            
            // Disable inputs
            document.getElementById('promoCode').disabled = true;
            document.getElementById('applyPromo').disabled = true;
            
            showNotification('Promo code applied successfully!');
        } else {
            showNotification('Invalid promo code. Try WELCOME10 for 10% off.', 'error');
        }
    }
    
    // Render recommended products
    function renderRecommendedProducts() {
        const recommendedContainer = document.getElementById('recommendedProducts');
        if (!recommendedContainer) return;
        
        // Sample recommended products
        const recommendedProducts = [
            {
                id: 19,
                name: 'Adidas Harden Vol. 9 "Cyber Metallic" ',
                brand: 'Adidas',
                price: 160.00,
                image: '/Assests/Adidas/Basketball/Mens/AE1/ae1.png',
            },
            {
                id: 17,
                name: 'Adidas UltraBOOST 1.0',
                brand: 'Adidas',
                price: 200.00,
                image: '/Assests/Adidas/Running/Womens/AUB/aub.png',
            },
            {
                id: 12,
                name: 'Air Force 1 "07',
                brand: 'Nike',
                price: 132.69,
                image: '/Assests/Nike/Lifestyle/Womens/WAF1/waf1.jpg',
            }
        ];
        
        let html = '';
        
        recommendedProducts.forEach(product => {
            html += `
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <div class="product-info p-3">
                            <h5 class="product-title">${product.name}</h5>
                            <p class="product-brand">${product.brand}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="product-price">$${product.price.toFixed(2)}</span>
                                <button class="btn btn-sm btn-primary add-recommended" data-id="${product.id}">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        recommendedContainer.innerHTML = html;
        
        // Add event listeners
        document.querySelectorAll('.add-recommended').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const product = recommendedProducts.find(p => p.id === id);
                
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
}

// Initialize PayPal buttons
function initPayPalButtons() {
    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer) return;
    
    paypal.Buttons({
        // Configure the transaction
        createOrder: function(data, actions) {
            // Calculate total from order summary
            const orderTotal = document.getElementById('orderTotal');
            const total = parseFloat(orderTotal.textContent.replace('$', ''));
            
            // Create the order
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: total.toFixed(2)
                    }
                }]
            });
        },
        
        // Handle the successful transaction
        onApprove: function(data, actions) {
            // Capture the funds
            return actions.order.capture().then(function(details) {
                // Show success message
                showNotification('Payment completed successfully!');
                
                // Generate order number
                const orderNumber = 'UT' + Date.now().toString().substring(5);
                
                // Show confirmation modal
                const confirmationOrderNumber = document.getElementById('confirmationOrderNumber');
                confirmationOrderNumber.textContent = orderNumber;
                
                const confirmationModal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
                confirmationModal.show();
                
                // Clear cart
                cart = [];
                saveCart();
                updateCartUI();
                
                // If on cart page, update cart display
                const cartItemsList = document.getElementById('cartItemsList');
                if (cartItemsList) {
                    cartItemsList.innerHTML = `
                        <div class="text-center py-5 empty-cart-message">
                            <i class="bi bi-cart-x display-1 text-muted"></i>
                            <h4 class="mt-3">Your cart is empty</h4>
                            <p class="text-muted">Looks like you haven't added anything to your cart yet.</p>
                            <a href="product.html" class="btn btn-primary mt-3">Browse Products</a>
                        </div>
                    `;
                    
                    // Update summary
                    const cartItemCount = document.getElementById('cartItemCount');
                    const orderSubtotal = document.getElementById('orderSubtotal');
                    const orderShipping = document.getElementById('orderShipping');
                    const orderTax = document.getElementById('orderTax');
                    const orderTotal = document.getElementById('orderTotal');
                    
                    if (cartItemCount) cartItemCount.textContent = '0';
                    if (orderSubtotal) orderSubtotal.textContent = '$0.00';
                    if (orderShipping) orderShipping.textContent = '$0.00';
                    if (orderTax) orderTax.textContent = '$0.00';
                    if (orderTotal) orderTotal.textContent = '$0.00';
                    
                    // Hide discount row if visible
                    const discountRow = document.querySelector('.discount-row');
                    if (discountRow) discountRow.classList.add('d-none');
                }
            });
        },
        
        // Handle errors
        onError: function(err) {
            console.error('PayPal Error:', err);
            showNotification('There was an error processing your payment. Please try again.', 'error');
        }
    }).render('#paypal-button-container');
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
    
    // Update cart page if on it
    const cartItemsList = document.getElementById('cartItemsList');
    if (cartItemsList) {
        initCartPage();
    }
    
    showNotification(`${product.name} added to cart!`);
}

// Update cart UI in header
function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    if (!cartCount) return;
    
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update dropdown if it exists
    if (cartItems) {
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
            name: 'Air Jordan 1 Retro High OG',
            brand: 'Jordan',
            price: 179.99,
            image: '../assets/product-1.jpg',
            category: 'Basketball'
        },
        {
            id: 2,
            name: 'Yeezy Boost 350 V2',
            brand: 'Adidas',
            price: 249.99,
            image: '../assets/product-2.jpg',
            category: 'Lifestyle'
        },
        {
            id: 3,
            name: 'Nike Dunk Low',
            brand: 'Nike',
            price: 129.99,
            image: '../assets/product-3.jpg',
            category: 'Lifestyle'
        },
        {
            id: 4,
            name: 'New Balance 550',
            brand: 'New Balance',
            price: 119.99,
            image: '../assets/product-4.jpg',
            category: 'Lifestyle'
        },
        {
            id: 5,
            name: 'Air Jordan 4 Retro',
            brand: 'Jordan',
            price: 209.99,
            image: '../assets/product-5.jpg',
            category: 'Basketball'
        },
        {
            id: 6,
            name: 'Adidas Forum Low',
            brand: 'Adidas',
            price: 99.99,
            image: '../assets/product-6.jpg',
            category: 'Lifestyle'
        },
        {
            id: 7,
            name: 'Nike Air Force 1 Low',
            brand: 'Nike',
            price: 109.99,
            image: '../assets/product-7.jpg',
            category: 'Lifestyle'
        },
        {
            id: 8,
            name: 'Puma Suede Classic',
            brand: 'Puma',
            price: 79.99,
            image: '../assets/product-8.jpg',
            category: 'Lifestyle'
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