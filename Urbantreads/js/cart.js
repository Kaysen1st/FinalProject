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
            
            // Check if user is logged in
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.isLoggedIn) {
                // User is not logged in, show login/register modal
                showCheckoutLoginModal();
            } else {
                // User is logged in, show payment method selection
                showPaymentMethodModal();
            }
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
        
        if (quantityInputs.length === 0) {
            subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
        
        const shipping = subtotal > 0 ? (subtotal >= 200 ? 0 : 9.99) : 0;
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
        if (promoCode === 'DADDYSAMUEL') {
            // Calculate 10% discount
            const subtotal = parseFloat(orderSubtotal.textContent.replace('$', ''));
            const discount = subtotal * 0.5 ;                    
            
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
            showNotification('Invalid promo code. Try DADDYSAMUEL for 50% off.', 'error');
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
                image: '/Assests/Adidas/Basketball/Mens/AH9/ah9.png',
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

// Function to show login/register modal for checkout
function showCheckoutLoginModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('checkoutLoginModal')) {
        const modalHTML = `
            <div class="modal fade" id="checkoutLoginModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="row g-0">
                                <!-- Login Container -->
                                <div id="loginContainer">
                                    <div class="row g-0">
                                        <!-- Left side - Login Image -->
                                        <div class="col-md-5 d-none d-md-block">
                                            <div class="login-image h-100">
                                                <div class="logo-container">
                                                    <img src="/Assests/logo.png" alt="UrbanTreads Logo" class="logo" style="height: 60px;">
                                                </div>
                                                <img src="/Assests/login banner.webp" alt="Login" class="img-fluid h-100" style="object-fit: cover;">
                                            </div>
                                        </div>
                                        
                                        <!-- Right side - Login Form -->
                                        <div class="col-md-7">
                                            <div class="checkout-form-container p-4">
                                                <div class="d-flex justify-content-center mb-4">
                                                    <div class="auth-toggle">
                                                        <button class="auth-toggle-btn active" id="loginToggleBtn">Login</button>
                                                        <button class="auth-toggle-btn" id="registerToggleBtn">Register</button>
                                                    </div>
                                                </div>
                                                
                                                <form id="checkoutLoginForm">
                                                    <div class="mb-3">
                                                        <label for="checkoutLoginEmail" class="form-label">Email Address</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                                            <input type="email" class="form-control" id="checkoutLoginEmail" placeholder="you@email.com" required>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="mb-3">
                                                        <label for="checkoutLoginPassword" class="form-label">Password</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text"><i class="bi bi-key"></i></span>
                                                            <input type="password" class="form-control" id="checkoutLoginPassword" placeholder="••••••" required>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="d-flex justify-content-between align-items-center mb-4">
                                                        <div class="form-check">
                                                            <input type="checkbox" class="form-check-input" id="checkoutRememberMe">
                                                            <label class="form-check-label" for="checkoutRememberMe">Remember me</label>
                                                        </div>
                                                        <a href="#" class="forgot-password">Forgot Password?</a>
                                                    </div>
                                                    
                                                    <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">Login & Continue</button>
                                                </form>
                                                
                                                <div class="separator mt-4">
                                                    <span>or</span>
                                                </div>
                                                
                                                <div class="social-login mt-4">
                                                    <button class="btn btn-facebook w-100 mb-2">
                                                        <i class="bi bi-facebook me-2"></i> Login with Facebook
                                                    </button>
                                                    <button class="btn btn-google w-100">
                                                        <i class="bi bi-google me-2"></i> Login with Google
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Register Container -->
                                <div id="registerContainer" style="display: none;">
                                    <div class="row g-0">
                                        <!-- Left side - Register Image -->
                                        <div class="col-md-5 d-none d-md-block">
                                            <div class="login-image h-100">
                                                <div class="logo-container">
                                                    <img src="/Assests/logo.png" alt="UrbanTreads Logo" class="logo" style="height: 60px;">
                                                </div>
                                                <!-- Different image for register tab -->
                                                <img src="/Assests/model.jpg" alt="Register" class="img-fluid h-100" style="object-fit: cover;">
                                            </div>
                                        </div>
                                        
                                        <!-- Right side - Register Form -->
                                        <div class="col-md-7">
                                            <div class="checkout-form-container p-4">
                                                <div class="d-flex justify-content-center mb-4">
                                                    <div class="auth-toggle">
                                                        <button class="auth-toggle-btn" id="loginToggleBtn2">Login</button>
                                                        <button class="auth-toggle-btn active" id="registerToggleBtn2">Register</button>
                                                    </div>
                                                </div>
                                                
                                                <form id="checkoutRegisterForm">
                                                    <div class="mb-3">
                                                        <label for="checkoutRegisterName" class="form-label">Name</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                                                            <input type="text" class="form-control" id="checkoutRegisterName" placeholder="Juan Dela Cruz" required>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="mb-3">
                                                        <label for="checkoutRegisterEmail" class="form-label">Email</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                                                            <input type="email" class="form-control" id="checkoutRegisterEmail" placeholder="you@email.com" required>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="mb-3">
                                                        <label for="checkoutRegisterPassword" class="form-label">Password</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text"><i class="bi bi-key"></i></span>
                                                            <input type="password" class="form-control" id="checkoutRegisterPassword" placeholder="••••••" required>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="mb-3">
                                                        <label for="checkoutConfirmPassword" class="form-label">Confirm Password</label>
                                                        <div class="input-group">
                                                            <span class="input-group-text"><i class="bi bi-key"></i></span>
                                                            <input type="password" class="form-control" id="checkoutConfirmPassword" placeholder="••••••" required>
                                                        </div>
                                                    </div>
                                                    
                                                    <button type="submit" class="btn btn-primary w-100 py-2 fw-bold">Register & Continue</button>
                                                </form>
                                                
                                                <div class="separator mt-4">
                                                    <span>or</span>
                                                </div>
                                                
                                                <div class="social-login mt-4">
                                                    <button class="btn btn-facebook w-100 mb-2">
                                                        <i class="bi bi-facebook me-2"></i> Register with Facebook
                                                    </button>
                                                    <button class="btn btn-google w-100">
                                                        <i class="bi bi-google me-2"></i> Register with Google
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add custom styles for checkout modal
        const style = document.createElement('style');
        style.textContent = `
            .auth-toggle {
                display: flex;
                justify-content: center;
                border: 1px solid #dee2e6;
                border-radius: 50px;
                overflow: hidden;
                width: 100%;
                max-width: 300px;
            }
            
            .auth-toggle-btn {
                background: none;
                border: none;
                padding: 10px 30px;
                flex: 1;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 500;
                color: #6c757d;
            }
            
            .auth-toggle-btn.active {
                background-color: var(--primary-color);
                color: white;
            }
            
            .btn-facebook {
                background-color: #3b5998;
                color: white;
            }
            
            .btn-facebook:hover {
                background-color: #2d4373;
                color: white;
            }
            
            .btn-google {
                background-color: white;
                color: #444;
                border: 1px solid #ddd;
            }
            
            .btn-google:hover {
                background-color: #f1f1f1;
            }
            
            .checkout-form-container {
                max-width: 100%;
                height: 100%;
                overflow-y: auto;
                padding: 30px !important;
            }
            
            .separator {
                display: flex;
                align-items: center;
                text-align: center;
                margin: 1.5rem 0;
            }
            
            .separator::before,
            .separator::after {
                content: '';
                flex: 1;
                border-bottom: 1px solid #eee;
            }
            
            .separator span {
                padding: 0 10px;
                color: var(--gray-color);
                font-size: 0.9rem;
            }
            
            .forgot-password {
                color: var(--primary-color);
                font-size: 0.9rem;
                text-decoration: none;
            }
            
            .forgot-password:hover {
                text-decoration: underline;
            }
            
            .login-image {
                position: relative;
                background-color: #f8f9fa;
            }
            
            .logo-container {
                position: absolute;
                top: 20px;
                left: 20px;
                z-index: 10;
            }
            
            @media (max-width: 767.98px) {
                .auth-toggle-btn {
                    padding: 8px 20px;
                    font-size: 0.9rem;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add toggle functionality between login and register
        document.getElementById('loginToggleBtn').addEventListener('click', function() {
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('registerContainer').style.display = 'none';
            this.classList.add('active');
            document.getElementById('registerToggleBtn').classList.remove('active');
        });
        
        document.getElementById('registerToggleBtn').addEventListener('click', function() {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('registerContainer').style.display = 'block';
            this.classList.add('active');
            document.getElementById('loginToggleBtn').classList.remove('active');
        });
        
        document.getElementById('loginToggleBtn2').addEventListener('click', function() {
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('registerContainer').style.display = 'none';
            this.classList.add('active');
            document.getElementById('registerToggleBtn2').classList.remove('active');
            document.getElementById('loginToggleBtn').classList.add('active');
            document.getElementById('registerToggleBtn').classList.remove('active');
        });
        
        document.getElementById('registerToggleBtn2').addEventListener('click', function() {
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('registerContainer').style.display = 'block';
            this.classList.add('active');
            document.getElementById('loginToggleBtn2').classList.remove('active');
            document.getElementById('registerToggleBtn').classList.add('active');
            document.getElementById('loginToggleBtn').classList.remove('active');
        });
        
        // Handle login form submission
        document.getElementById('checkoutLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('checkoutLoginEmail').value;
            const password = document.getElementById('checkoutLoginPassword').value;
            
            // Simulate login (in a real app, this would call your authentication API)
            processCheckoutLogin(email, password);
        });
        
        // Handle register form submission
        document.getElementById('checkoutRegisterForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('checkoutRegisterName').value;
            const email = document.getElementById('checkoutRegisterEmail').value;
            const password = document.getElementById('checkoutRegisterPassword').value;
            const confirmPassword = document.getElementById('checkoutConfirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            // Simulate registration (in a real app, this would call your registration API)
            processCheckoutRegistration(name, email, password);
        });
    }
    
    // Show the modal
    const loginModal = new bootstrap.Modal(document.getElementById('checkoutLoginModal'));
    loginModal.show();
}

// Function to process checkout login
function processCheckoutLogin(email, password) {
    
    showNotification('Logging you in...', 'success');
    
    setTimeout(() => {
        // Create user object
        const userData = {
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), // Capitalize first letter of email username
            email: email,
            isLoggedIn: true,
            firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            lastName: ''
        };
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Hide login modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('checkoutLoginModal'));
        loginModal.hide();
        
        // Update user menu
        initUserMenu();
        
        // Show payment method modal
        showPaymentMethodModal();
    }, 1500);
}

// Function to process checkout registration
function processCheckoutRegistration(name, email, password) {
    
    showNotification('Creating your account...', 'success');
    
    setTimeout(() => {
        // Create user object
        const userData = {
            name: name,
            email: email,
            isLoggedIn: true,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ')
        };
        
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Hide login modal
        const loginModal = bootstrap.Modal.getInstance(document.getElementById('checkoutLoginModal'));
        loginModal.hide();
        
        // Update user menu
        initUserMenu();
        
        // Show payment method modal
        showPaymentMethodModal();
    }, 1500);
}

// Function to show payment method selection modal
function showPaymentMethodModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('paymentMethodModal')) {
        const modalHTML = `
            <div class="modal fade" id="paymentMethodModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Select Payment Method</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="payment-methods">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <div class="payment-method-card" data-method="cod">
                                            <div class="payment-method-icon">
                                                <i class="bi bi-cash"></i>
                                            </div>
                                            <div class="payment-method-title">Cash on Delivery</div>
                                            <div class="payment-method-description">Pay when you receive your order</div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="payment-method-card" data-method="card">
                                            <div class="payment-method-icon">
                                                <i class="bi bi-credit-card"></i>
                                            </div>
                                            <div class="payment-method-title">Credit/Debit Card</div>
                                            <div class="payment-method-description">Pay securely with your card</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles for payment method cards
        const style = document.createElement('style');
        style.textContent = `
            .payment-method-card {
                border: 2px solid #eee;
                border-radius: 8px;
                padding: 1.5rem;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s ease;
                height: 100%;
            }
            
            .payment-method-card:hover {
                border-color: var(--primary-color);
                transform: translateY(-5px);
            }
            
            .payment-method-icon {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                color: var(--primary-color);
            }
            
            .payment-method-title {
                font-weight: 600;
                margin-bottom: 0.5rem;
            }
            
            .payment-method-description {
                font-size: 0.9rem;
                color: var(--gray-color);
            }
        `;
        document.head.appendChild(style);
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listeners to payment method cards
// Update the event listener for payment method cards in cart.js
document.querySelectorAll('.payment-method-card').forEach(card => {
    card.addEventListener('click', function() {
        const method = this.getAttribute('data-method');
        
        // Hide payment method modal
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentMethodModal'));
        paymentModal.hide();
        
        if (method === 'cod') {
            // Process Cash on Delivery order
            processCodOrder();
        } else if (method === 'card') {
            // Check if user has saved payment methods
            const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || [];
            
            // Find default payment method
            const defaultMethod = paymentMethods.find(method => method.isDefault);
            
            if (paymentMethods.length > 0) {
                if (defaultMethod) {
                    // Use default payment method
                    processCardOrder(defaultMethod);
                } else {
                    // Use first payment method
                    processCardOrder(paymentMethods[0]);
                }
            } else {
                // No saved payment methods, show a modal to add one or use PayPal
                showAddPaymentMethodModal();
            }
        }
    });
});

// Function to process order with saved card
function processCardOrder(paymentMethod) {
    showNotification(`Processing payment with card ending in ${paymentMethod.cardNumber.slice(-4)}...`, 'success');
    
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'UT' + Date.now().toString().substring(5);
        
        // Save order to user's orders
        saveOrderToUserHistory(orderNumber, 'Credit/Debit Card');
        
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
    }, 2000);
}

// Function to show add payment method modal
function showAddPaymentMethodModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('checkoutAddPaymentModal')) {
        const modalHTML = `
            <div class="modal fade" id="checkoutAddPaymentModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Payment Method</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>You don't have any saved payment methods. Would you like to add one now or use PayPal checkout?</p>
                            <form id="checkoutPaymentMethodForm">
                                <div class="mb-3">
                                    <label for="checkoutCardName" class="form-label">Name on Card</label>
                                    <input type="text" class="form-control" id="checkoutCardName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="checkoutCardNumber" class="form-label">Card Number</label>
                                    <input type="text" class="form-control" id="checkoutCardNumber" placeholder="1234 5678 9012 3456" required>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-6 mb-3 mb-md-0">
                                        <label for="checkoutCardExpiry" class="form-label">Expiration Date</label>
                                        <input type="text" class="form-control" id="checkoutCardExpiry" placeholder="MM/YY" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="checkoutCardCvc" class="form-label">CVC</label>
                                        <input type="text" class="form-control" id="checkoutCardCvc" placeholder="123" required>
                                    </div>
                                </div>
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="checkoutDefaultPayment" checked>
                                    <label class="form-check-label" for="checkoutDefaultPayment">
                                        Set as default payment method
                                    </label>
                                </div>
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-primary">Save & Pay Now</button>
                                    <button type="button" class="btn btn-outline-secondary" id="usePayPalInstead">Use PayPal Instead</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Handle payment method form submission
        document.getElementById('checkoutPaymentMethodForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const cardName = document.getElementById('checkoutCardName').value;
            const cardNumber = document.getElementById('checkoutCardNumber').value;
            const cardExpiry = document.getElementById('checkoutCardExpiry').value;
            const cardCvc = document.getElementById('checkoutCardCvc').value;
            const isDefault = document.getElementById('checkoutDefaultPayment').checked;
            
            // Create payment method object
            const paymentMethod = {
                id: Date.now(),
                cardName,
                cardNumber: cardNumber.slice(-4).padStart(cardNumber.length, '*'),
                cardExpiry,
                isDefault
            };
            
            // Get existing payment methods
            let paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || [];
            
            // If this is set as default, unset any existing default
            if (isDefault) {
                paymentMethods = paymentMethods.map(method => ({
                    ...method,
                    isDefault: false
                }));
            }
            
            // Add new payment method
            paymentMethods.push(paymentMethod);
            
            // Save payment methods
            localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutAddPaymentModal'));
            modal.hide();
            
            // Process order with new payment method
            processCardOrder(paymentMethod);
        });
        
        // Handle "Use PayPal Instead" button
        document.getElementById('usePayPalInstead').addEventListener('click', function() {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutAddPaymentModal'));
            modal.hide();
            
            // Scroll to PayPal button
            document.getElementById('paypal-button-container').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
    
    // Show the modal
    const addPaymentModal = new bootstrap.Modal(document.getElementById('checkoutAddPaymentModal'));
    addPaymentModal.show();
}
    }
    
    // Show the modal
    const paymentModal = new bootstrap.Modal(document.getElementById('paymentMethodModal'));
    paymentModal.show();
}

// Function to process Cash on Delivery order
function processCodOrder() {
    showNotification('Processing your order...', 'success');
    
    setTimeout(() => {
        // Generate order number
        const orderNumber = 'UT' + Date.now().toString().substring(5);
        
        // Save order to user's orders
        saveOrderToUserHistory(orderNumber, 'Cash on Delivery');
        
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
            // Continuation of cart.js
            if (discountRow) discountRow.classList.add('d-none');
        }
    }, 1500);
}

// Save order to user's order history
function saveOrderToUserHistory(orderNumber, paymentMethod) {
    // Get current user
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
    
    // Get current date
    const orderDate = new Date().toISOString().split('T')[0];
    
    // Calculate order total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = total > 0 ? (total >= 200 ? 0 : 9.99) : 0;
    const tax = total * 0.08;
    const orderTotal = total + shipping + tax;
    
    // Create new order
    const newOrder = {
        id: orderNumber,
        date: orderDate,
        total: orderTotal,
        status: 'processing',
        paymentMethod: paymentMethod,
        products: [...cart]
    };
    
    // Get existing orders or initialize empty array
    let userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    // Add new order
    userOrders.push(newOrder);
    
    // Save updated orders
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
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
                
                // Save order to user's orders
                saveOrderToUserHistory(orderNumber, 'PayPal/Card');
                
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