document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isLoggedIn) {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    // Initialize the account page
    initAccountPage();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize user menu
    initUserMenu();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Load cart from localStorage
    loadCart();
});

// Initialize account page
function initAccountPage() {
    // Get user data
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Update user profile in sidebar
    const userProfileName = document.querySelector('.user-profile-name');
    const userProfileEmail = document.querySelector('.user-profile-email');
    if (userProfileName) userProfileName.textContent = user.name || 'User';
    if (userProfileEmail) userProfileEmail.textContent = user.email || '';
    
    // Fill profile form with user data
    const profileFirstName = document.getElementById('profileFirstName');
    const profileLastName = document.getElementById('profileLastName');
    const profileEmail = document.getElementById('profileEmail');
    const profilePhone = document.getElementById('profilePhone');
    const profileBirthdate = document.getElementById('profileBirthdate');
    
    if (profileFirstName && user.firstName) profileFirstName.value = user.firstName;
    if (profileFirstName && !user.firstName && user.name) profileFirstName.value = user.name.split(' ')[0];
    if (profileLastName && user.lastName) profileLastName.value = user.lastName;
    if (profileLastName && !user.lastName && user.name && user.name.split(' ').length > 1) {
        profileLastName.value = user.name.split(' ').slice(1).join(' ');
    }
    if (profileEmail) profileEmail.value = user.email || '';
    if (profilePhone) profilePhone.value = user.phone || '';
    if (profileBirthdate) profileBirthdate.value = user.birthdate || '';
    
    // Handle profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Update user data
            const updatedUser = {
                ...user,
                firstName: profileFirstName.value,
                lastName: profileLastName.value,
                name: `${profileFirstName.value} ${profileLastName.value}`,
                email: profileEmail.value,
                phone: profilePhone.value,
                birthdate: profileBirthdate.value
            };
            
            // Save updated user data
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Update UI
            userProfileName.textContent = updatedUser.name;
            userProfileEmail.textContent = updatedUser.email;
            
            // Update user menu
            const userNameElement = document.querySelector('.user-name');
            if (userNameElement) userNameElement.textContent = updatedUser.name;
            
            // Show success message
            showNotification('Profile updated successfully');
        });
    }
    
    // Handle settings form submission
    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get settings values
            const emailNotifications = document.getElementById('emailNotifications').checked;
            const orderUpdates = document.getElementById('orderUpdates').checked;
            const promotionalEmails = document.getElementById('promotionalEmails').checked;
            const newReleases = document.getElementById('newReleases').checked;
            const activityTracking = document.getElementById('activityTracking').checked;
            const saveSearchHistory = document.getElementById('saveSearchHistory').checked;
            
            // Update user settings
            const updatedUser = {
                ...user,
                settings: {
                    emailNotifications,
                    orderUpdates,
                    promotionalEmails,
                    newReleases,
                    activityTracking,
                    saveSearchHistory
                }
            };
            
            // Save updated user data
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Show success message
            showNotification('Settings saved successfully');
        });
    }
    
    // Handle tab navigation with URL hash
    const hash = window.location.hash;
    if (hash) {
        const tabId = hash.substring(1);
        const tabElement = document.querySelector(`[href="#${tabId}"]`);
        if (tabElement) {
            tabElement.click();
        }
    }
    
    // Handle tab clicks - update URL hash
    document.querySelectorAll('[data-bs-toggle="list"]').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('href').substring(1);
            window.location.hash = tabId;
        });
    });
    
    // Load orders (real data from localStorage)
    loadOrders();
    
    // Load wishlist (demo data)
    loadWishlist();
    
    // Load addresses
    loadAddresses();
    
    // Load payment methods
    loadPaymentMethods();
    
    // Handle address form submission
    const addressForm = document.getElementById('addressForm');
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const addressName = document.getElementById('addressName').value;
            const firstName = document.getElementById('addressFirstName').value;
            const lastName = document.getElementById('addressLastName').value;
            const street = document.getElementById('addressStreet').value;
            const apt = document.getElementById('addressApt').value;
            const city = document.getElementById('addressCity').value;
            const state = document.getElementById('addressState').value;
            const zip = document.getElementById('addressZip').value;
            const phone = document.getElementById('addressPhone').value;
            const isDefault = document.getElementById('defaultAddress').checked;
            
            // Create address object
            const address = {
                id: Date.now(), // Use timestamp as unique ID
                name: addressName,
                firstName,
                lastName,
                street,
                apt,
                city,
                state,
                zip,
                phone,
                isDefault
            };
            
            // Get existing addresses
            let addresses = JSON.parse(localStorage.getItem('addresses')) || [];
            
            // If this is set as default, unset any existing default
            if (isDefault) {
                addresses = addresses.map(addr => ({
                    ...addr,
                    isDefault: false
                }));
            }
            
            // Add new address
            addresses.push(address);
            
            // Save addresses
            localStorage.setItem('addresses', JSON.stringify(addresses));
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAddressModal'));
            modal.hide();
            
            // Reload addresses
            loadAddresses();
            
            // Show success message
            showNotification('Address added successfully');
            
            // Reset form
            addressForm.reset();
        });
    }
    
    // Handle payment method form submission
    const paymentMethodForm = document.getElementById('paymentMethodForm');
    if (paymentMethodForm) {
        paymentMethodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const cardName = document.getElementById('cardName').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const cardExpiry = document.getElementById('cardExpiry').value;
            const cardCvc = document.getElementById('cardCvc').value;
            const isDefault = document.getElementById('defaultPayment').checked;
            
            // Create payment method object
            const paymentMethod = {
                id: Date.now(), // Use timestamp as unique ID
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
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPaymentModal'));
            modal.hide();
            
            // Reload payment methods
            loadPaymentMethods();
            
            // Show success message
            showNotification('Payment method added successfully');
            
            // Reset form
            paymentMethodForm.reset();
        });
    }
    
    // Handle delete account form submission
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    if (deleteAccountForm) {
        deleteAccountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real app, we would verify the password against the user's account
            // For this demo, we'll just clear the user data
            
            localStorage.removeItem('user');
            localStorage.removeItem('addresses');
            localStorage.removeItem('paymentMethods');
            
            // Show success message
            showNotification('Account deleted successfully');
            
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 2000);
        });
    }
    
    // Handle logout button
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
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
    });
}

// Load orders from localStorage
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    // Get orders from localStorage
    const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    
    // Check if there are orders
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state text-center py-5">
                <i class="bi bi-bag display-1 text-muted"></i>
                <h4 class="mt-3">No orders yet</h4>
                <p class="text-muted">When you place an order, it will appear here</p>
                <a href="product.html" class="btn btn-primary mt-3">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Render orders
    let ordersHTML = '';
    
    userOrders.forEach(order => {
        // Format date
        const orderDate = new Date(order.date);
        const formattedDate = orderDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Get status class
        let statusClass = '';
        switch (order.status) {
            case 'delivered':
                statusClass = 'order-status-delivered';
                break;
            case 'processing':
                statusClass = 'order-status-processing';
                break;
            case 'shipped':
                statusClass = 'order-status-shipped';
                break;
            case 'cancelled':
                statusClass = 'order-status-cancelled';
                break;
        }
        
        // Create order HTML
        ordersHTML += `
            <div class="order-card">
                <div class="order-header d-flex justify-content-between align-items-center">
                    <div>
                        <div class="text-muted mb-1">Order #${order.id}</div>
                        <div>${formattedDate}</div>
                    </div>
                    <div class="d-flex flex-column align-items-end">
                        <span class="order-status ${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        <div class="mt-1">Total: $${order.total.toFixed(2)}</div>
                        <div class="mt-1 small text-muted">Payment: ${order.paymentMethod}</div>
                    </div>
                </div>
                <div class="order-body">
                    <div class="order-products">
        `;
        
        // Add products
        order.products.forEach(product => {
            ordersHTML += `
                <div class="order-product">
                    <img src="${product.image}" alt="${product.name}" class="order-product-image">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${product.name}</h6>
                        <div class="d-flex justify-content-between">
                            <div class="text-muted">Qty: ${product.quantity}</div>
                            <div>$${product.price.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Close order card
        ordersHTML += `
                    </div>
                    <div class="d-flex justify-content-between mt-3">
                        <a href="#" class="btn btn-sm btn-outline-primary">View Details</a>
                        <a href="#" class="btn btn-sm btn-outline-secondary">Track Order</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update orders list
    ordersList.innerHTML = ordersHTML;
}

// Load wishlist (demo data)
function loadWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistItems) return;
    
    // Demo wishlist items
    const wishlist = [
        {
            id: 2,
            name: 'Sabrina 2 EP',
            brand: 'Nike',
            price: 190.20,
            image: '/Assests/Nike/Basketball/Womens/SB2/sb2.png'
        },
        {
            id: 12,
            name: 'Air Force 1 "07',
            brand: 'Nike',
            price: 132.69,
            image: '/Assests/Nike/Lifestyle/Womens/WAF1/waf1.jpg',
        },
        {
            id: 19,
            name: 'Adidas Harden Vol. 9 "Cyber Metallic" ',
            brand: 'Adidas',
            price: 160.00,
            image: '/Assests/Adidas/Basketball/Mens/AH9/ah9.png'
        }
    ];
    
    // Check if wishlist is empty
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="col-12 empty-state text-center py-5">
                <i class="bi bi-heart display-1 text-muted"></i>
                <h4 class="mt-3">Your wishlist is empty</h4>
                <p class="text-muted">Save items you love to your wishlist</p>
                <a href="product.html" class="btn btn-primary mt-3">Browse Products</a>
            </div>
        `;
        return;
    }
    
    // Render wishlist items
    let wishlistHTML = '';
    
    wishlist.forEach(item => {
        wishlistHTML += `
            <div class="col-md-4 mb-4">
                <div class="wishlist-card">
                    <button class="wishlist-remove-btn" data-id="${item.id}">
                        <i class="bi bi-x"></i>
                    </button>
                    <img src="${item.image}" alt="${item.name}" class="wishlist-image">
                    <div class="wishlist-info">
                        <h5 class="wishlist-title">${item.name}</h5>
                        <p class="text-muted mb-2">${item.brand}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="wishlist-price">$${item.price.toFixed(2)}</div>
                            <button class="btn btn-sm btn-primary add-to-cart-from-wishlist" data-id="${item.id}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update wishlist
    wishlistItems.innerHTML = wishlistHTML;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.wishlist-remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            
            // Remove item from wishlist (in a real app)
            // wishlist = wishlist.filter(item => item.id !== itemId);
            
            // Remove the item from the DOM
            this.closest('.col-md-4').remove();
            
            // Show success message
            showNotification('Item removed from wishlist');
            
            // Check if wishlist is now empty
            if (document.querySelectorAll('.wishlist-card').length === 0) {
                wishlistItems.innerHTML = `
                    <div class="col-12 empty-state text-center py-5">
                        <i class="bi bi-heart display-1 text-muted"></i>
                        <h4 class="mt-3">Your wishlist is empty</h4>
                        <p class="text-muted">Save items you love to your wishlist</p>
                        <a href="product.html" class="btn btn-primary mt-3">Browse Products</a>
                    </div>
                `;
            }
        });
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart-from-wishlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            const item = wishlist.find(item => item.id === itemId);
            
            if (item) {
                // Add to cart (simulated)
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Check if item already exists in cart
                const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
                
                if (existingItemIndex !== -1) {
                    // Update quantity if product already exists
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add new item to cart
                    cart.push({
                        ...item,
                        quantity: 1
                    });
                }
                
                // Save cart to localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Update cart UI
                loadCart();
                
                // Show success message
                showNotification(`${item.name} added to cart!`);
            }
        });
    });
}

// Load addresses
function loadAddresses() {
    const addressesList = document.getElementById('addressesList');
    if (!addressesList) return;
    
    // Get addresses from localStorage
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    
    // Check if there are addresses
    if (addresses.length === 0) {
        addressesList.innerHTML = `
            <div class="col-12 empty-state text-center py-5">
                <i class="bi bi-geo-alt display-1 text-muted"></i>
                <h4 class="mt-3">No addresses saved</h4>
                <p class="text-muted">Add a shipping or billing address</p>
                <button class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addAddressModal">Add Address</button>
            </div>
        `;
        return;
    }
    
    // Render addresses
    let addressesHTML = '';
    
    addresses.forEach(address => {
        addressesHTML += `
            <div class="col-md-6 mb-4">
                <div class="address-card ${address.isDefault ? 'default' : ''}">
                    <div class="address-header">
                        <div class="d-flex align-items-center">
                            <h5 class="address-title mb-0">${address.name}</h5>
                            ${address.isDefault ? '<span class="default-badge ms-2">Default</span>' : ''}
                        </div>
                    </div>
                    <div class="address-body">
                        <p class="mb-1">${address.firstName} ${address.lastName}</p>
                        <p class="mb-1">${address.street}${address.apt ? ', ' + address.apt : ''}</p>
                        <p class="mb-1">${address.city}, ${address.state} ${address.zip}</p>
                        <p class="mb-3">${address.phone}</p>
                        <div class="address-actions">
                            ${!address.isDefault ? `<button class="btn btn-sm btn-outline-primary set-default-address" data-id="${address.id}">Set as Default</button>` : ''}
                            <button class="btn btn-sm btn-outline-secondary edit-address" data-id="${address.id}">Edit</button>
                            <button class="btn btn-sm btn-outline-danger delete-address" data-id="${address.id}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update addresses list
    addressesList.innerHTML = addressesHTML;
    
    // Add event listeners to address buttons
    document.querySelectorAll('.set-default-address').forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = parseInt(this.getAttribute('data-id'));
            
            // Update addresses
            const updatedAddresses = addresses.map(address => ({
                ...address,
                isDefault: address.id === addressId
            }));
            
            // Save updated addresses
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
            
            // Reload addresses
            loadAddresses();
            
            // Show success message
            showNotification('Default address updated');
        });
    });
    
    document.querySelectorAll('.delete-address').forEach(btn => {
        btn.addEventListener('click', function() {
            const addressId = parseInt(this.getAttribute('data-id'));
            
            // Remove address
            const updatedAddresses = addresses.filter(address => address.id !== addressId);
            
            // Save updated addresses
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
            
            // Reload addresses
            loadAddresses();
            
            // Show success message
            showNotification('Address deleted');
        });
    });
}

// Load payment methods
function loadPaymentMethods() {
    const paymentMethodsList = document.getElementById('paymentMethodsList');
    if (!paymentMethodsList) return;
    
    // Get payment methods from localStorage
    const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods')) || [];
    
    // Check if there are payment methods
    if (paymentMethods.length === 0) {
        paymentMethodsList.innerHTML = `
            <div class="col-12 empty-state text-center py-5">
                <i class="bi bi-credit-card display-1 text-muted"></i>
                <h4 class="mt-3">No payment methods saved</h4>
                <p class="text-muted">Save your payment details for faster checkout</p>
                <button class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#addPaymentModal">Add Payment Method</button>
            </div>
        `;
        return;
    }
    
    // Render payment methods
    let paymentMethodsHTML = '';
    
    paymentMethods.forEach(method => {
        paymentMethodsHTML += `
            <div class="col-md-6 mb-4">
                <div class="payment-card ${method.isDefault ? 'default' : ''}">
                    <div class="payment-header">
                        <div class="d-flex align-items-center">
                            <h5 class="payment-title mb-0">
                                <i class="bi bi-credit-card"></i>
                                ${method.cardName}
                            </h5>
                            ${method.isDefault ? '<span class="default-badge ms-2">Default</span>' : ''}
                        </div>
                    </div>
                    <div class="payment-body">
                        <p class="payment-number">${method.cardNumber}</p>
                        <p class="payment-expiry">Expires: ${method.cardExpiry}</p>
                        <div class="payment-actions">
                            ${!method.isDefault ? `<button class="btn btn-sm btn-outline-primary set-default-payment" data-id="${method.id}">Set as Default</button>` : ''}
                            <button class="btn btn-sm btn-outline-danger delete-payment" data-id="${method.id}">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Update payment methods list
    paymentMethodsList.innerHTML = paymentMethodsHTML;
    
    // Add event listeners to payment method buttons
    document.querySelectorAll('.set-default-payment').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = parseInt(this.getAttribute('data-id'));
            
            // Update payment methods
            const updatedPaymentMethods = paymentMethods.map(method => ({
                ...method,
                isDefault: method.id === paymentId
            }));
            
            // Save updated payment methods
            localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
            
            // Reload payment methods
            loadPaymentMethods();
            
            // Show success message
            showNotification('Default payment method updated');
        });
    });
    
    document.querySelectorAll('.delete-payment').forEach(btn => {
        btn.addEventListener('click', function() {
            const paymentId = parseInt(this.getAttribute('data-id'));
            
            // Remove payment method
            const updatedPaymentMethods = paymentMethods.filter(method => method.id !== paymentId);
            
            // Save updated payment methods
            localStorage.setItem('paymentMethods', JSON.stringify(updatedPaymentMethods));
            
            // Reload payment methods
            loadPaymentMethods();
            
            // Show success message
            showNotification('Payment method deleted');
        });
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
    const logoutBtns = document.querySelectorAll('.logout-btn');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
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