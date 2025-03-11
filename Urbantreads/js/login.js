// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize login page
    initLoginPage();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize user menu
    initUserMenu();
    
    // Load cart
    loadCart();
});

// Initialize login page
function initLoginPage() {
    // Login form
    const loginPageForm = document.getElementById('loginPageForm');
    if (loginPageForm) {
        loginPageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginPageEmail').value;
            const password = document.getElementById('loginPagePassword').value;
            const rememberMe = document.getElementById('rememberMePage').checked;
            
            // Validate form
            if (!validateLoginForm(email, password)) {
                return;
            }
            
            // Simulate login
            simulateLogin(email, password, rememberMe);
        });
    }
    
    // Password toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('loginPagePassword');
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }
    
    // Show signup modal
    const showSignupBtn = document.getElementById('showSignupBtn');
    if (showSignupBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
            signupModal.show();
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAgree = document.getElementById('termsAgree').checked;
            
            // Validate form
            if (!validateSignupForm(name, email, password, confirmPassword, termsAgree)) {
                return;
            }
            
            // Simulate signup
            simulateSignup(name, email, password);
        });
    }
    
    // Signup password toggle
    const signupPasswordToggle = document.getElementById('signupPasswordToggle');
    if (signupPasswordToggle) {
        signupPasswordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('signupPassword');
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }
    
    // Confirm password toggle
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('confirmPassword');
            const icon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    }
}

// Validate login form
function validateLoginForm(email, password) {
    // Validate email
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate password
    if (!password) {
        showNotification('Please enter your password', 'error');
        return false;
    }
    
    return true;
}

// Validate signup form
function validateSignupForm(name, email, password, confirmPassword, termsAgree) {
    // Validate name
    if (!name) {
        showNotification('Please enter your name', 'error');
        return false;
    }
    
    // Validate email
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return false;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate password
    if (!password) {
        showNotification('Please enter a password', 'error');
        return false;
    }
    
    // Password strength validation
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return false;
    }
    
    // Validate confirm password
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return false;
    }
    
    // Validate terms agreement
    if (!termsAgree) {
        showNotification('Please agree to the Terms of Service and Privacy Policy', 'error');
        return false;
    }
    
    return true;
}

// Simulate login
function simulateLogin(email, password, rememberMe) {
    // In a real application, this would be an API call to a backend
    // For this demo, we'll simulate a successful login after a delay
    
    showNotification('Logging you in...', 'success');
    
    setTimeout(() => {
        // Store user info in localStorage if rememberMe is checked
        const name = email.split('@')[0]; // Extract name from email
        
        // Store user data
        const userData = {
            email: email,
            name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
            isLoggedIn: true,
            firstName: name.charAt(0).toUpperCase() + name.slice(1),
            lastName: ''
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Redirect to home page
        window.location.href = 'home.html';
    }, 1500);
}

// Simulate signup
function simulateSignup(name, email, password) {
    // In a real application, this would be an API call to a backend
    // For this demo, we'll simulate a successful signup after a delay
    
    showNotification('Creating your account...', 'success');
    
    setTimeout(() => {
        // Store user data
        const userData = {
            name: name,
            email: email,
            isLoggedIn: true,
            firstName: name.split(' ')[0],
            lastName: name.split(' ').slice(1).join(' ')
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Close signup modal
        const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
        signupModal.hide();
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500);
    }, 1500);
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
}

// Load cart from localStorage
function loadCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    
    if (!cartCount || !cartItems) return;
    
    // Get cart data
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count
    cartCount.textContent = cart.length;
    
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