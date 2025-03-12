/**
 * UrbanTreads Admin-User Integration
 * This file handles the synchronization between the admin dashboard and the user-facing storefront
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize integration
    initIntegration();
});

// Initialize integration
function initIntegration() {
    // Register event listeners for data changes
    registerEventListeners();
    
    // Set up shared data models
    setupSharedDataModels();
    
    // Initialize sync status indicators
    initSyncStatus();
}

// Register event listeners for data changes
function registerEventListeners() {
    // Listen for product changes
    document.addEventListener('product:created', syncProductToStore);
    document.addEventListener('product:updated', syncProductToStore);
    document.addEventListener('product:deleted', removeProductFromStore);
    
    // Listen for order changes
    document.addEventListener('order:updated', syncOrderToStore);
    document.addEventListener('order:status_changed', notifyCustomerOrderUpdate);
    
    // Listen for customer changes
    document.addEventListener('customer:updated', syncCustomerToStore);
    
    // Listen for global store settings changes
    document.addEventListener('settings:updated', syncSettingsToStore);
}

// Set up shared data models
function setupSharedDataModels() {
    // Create shared products repository
    window.sharedProductsRepo = {
        getAll: function() {
            return JSON.parse(localStorage.getItem('products')) || [];
        },
        getById: function(id) {
            const products = this.getAll();
            return products.find(p => p.id === id);
        },
        save: function(products) {
            localStorage.setItem('products', JSON.stringify(products));
            // Dispatch event for listeners
            document.dispatchEvent(new CustomEvent('sharedData:products_updated'));
        },
        update: function(product) {
            const products = this.getAll();
            const index = products.findIndex(p => p.id === product.id);
            
            if (index !== -1) {
                products[index] = product;
                this.save(products);
                return true;
            }
            return false;
        },
        create: function(product) {
            const products = this.getAll();
            // Ensure unique ID
            product.id = product.id || Date.now();
            products.push(product);
            this.save(products);
            return product;
        },
        delete: function(id) {
            const products = this.getAll();
            const filteredProducts = products.filter(p => p.id !== id);
            
            if (filteredProducts.length < products.length) {
                this.save(filteredProducts);
                return true;
            }
            return false;
        }
    };
    
    // Create shared orders repository
    window.sharedOrdersRepo = {
        getAll: function() {
            return JSON.parse(localStorage.getItem('orders')) || [];
        },
        getById: function(id) {
            const orders = this.getAll();
            return orders.find(o => o.id === id);
        },
        getByCustomerEmail: function(email) {
            const orders = this.getAll();
            return orders.filter(o => o.customer && o.customer.email === email);
        },
        save: function(orders) {
            localStorage.setItem('orders', JSON.stringify(orders));
            // Dispatch event for listeners
            document.dispatchEvent(new CustomEvent('sharedData:orders_updated'));
        },
        update: function(order) {
            const orders = this.getAll();
            const index = orders.findIndex(o => o.id === order.id);
            
            if (index !== -1) {
                orders[index] = order;
                this.save(orders);
                return true;
            }
            return false;
        },
        updateStatus: function(orderId, status) {
            const orders = this.getAll();
            const index = orders.findIndex(o => o.id === orderId);
            
            if (index !== -1) {
                orders[index].status = status;
                
                // Add status change note
                const statusNote = {
                    text: `Order status changed to ${status}`,
                    date: new Date().toISOString(),
                    user: 'Admin'
                };
                
                if (!orders[index].notes) {
                    orders[index].notes = [];
                }
                
                orders[index].notes.push(statusNote);
                this.save(orders);
                
                // Dispatch status change event
                document.dispatchEvent(new CustomEvent('order:status_changed', {
                    detail: {
                        orderId: orderId,
                        status: status,
                        order: orders[index]
                    }
                }));
                
                return true;
            }
            return false;
        },
        create: function(order) {
            const orders = this.getAll();
            // Ensure unique ID
            order.id = order.id || 'UT' + Date.now().toString().substring(5);
            orders.push(order);
            this.save(orders);
            return order;
        }
    };
    
    // Create shared customers repository
    window.sharedCustomersRepo = {
        getAll: function() {
            return JSON.parse(localStorage.getItem('customers')) || [];
        },
        getById: function(id) {
            const customers = this.getAll();
            return customers.find(c => c.id === id);
        },
        getByEmail: function(email) {
            const customers = this.getAll();
            return customers.find(c => c.email === email);
        },
        save: function(customers) {
            localStorage.setItem('customers', JSON.stringify(customers));
            // Dispatch event for listeners
            document.dispatchEvent(new CustomEvent('sharedData:customers_updated'));
        },
        update: function(customer) {
            const customers = this.getAll();
            const index = customers.findIndex(c => c.id === customer.id);
            
            if (index !== -1) {
                customers[index] = customer;
                this.save(customers);
                return true;
            }
            return false;
        },
        create: function(customer) {
            const customers = this.getAll();
            // Ensure unique ID
            customer.id = customer.id || Date.now();
            customers.push(customer);
            this.save(customers);
            return customer;
        },
        delete: function(id) {
            const customers = this.getAll();
            const filteredCustomers = customers.filter(c => c.id !== id);
            
            if (filteredCustomers.length < customers.length) {
                this.save(filteredCustomers);
                return true;
            }
            return false;
        }
    };
    
    // Create shared cart repository
    window.sharedCartRepo = {
        getByCustomerId: function(customerId) {
            const cartKey = `cart_${customerId}`;
            return JSON.parse(localStorage.getItem(cartKey)) || [];
        },
        saveForCustomer: function(customerId, cart) {
            const cartKey = `cart_${customerId}`;
            localStorage.setItem(cartKey, JSON.stringify(cart));
        },
        addItemToCustomerCart: function(customerId, item) {
            const cart = this.getByCustomerId(customerId);
            
            // Check if product already exists in cart
            const existingItemIndex = cart.findIndex(i => 
                i.productId === item.productId && 
                i.size === item.size
            );
            
            if (existingItemIndex !== -1) {
                // Update quantity if product exists
                cart[existingItemIndex].quantity += item.quantity;
            } else {
                // Add new item
                cart.push(item);
            }
            
            this.saveForCustomer(customerId, cart);
            return cart;
        },
        removeItemFromCustomerCart: function(customerId, itemIndex) {
            const cart = this.getByCustomerId(customerId);
            
            if (itemIndex >= 0 && itemIndex < cart.length) {
                cart.splice(itemIndex, 1);
                this.saveForCustomer(customerId, cart);
                return true;
            }
            return false;
        },
        clearCustomerCart: function(customerId) {
            this.saveForCustomer(customerId, []);
            return true;
        }
    };
    
    // Create shared settings repository
    window.sharedSettingsRepo = {
        get: function() {
            return JSON.parse(localStorage.getItem('storeSettings')) || this.getDefaultSettings();
        },
        save: function(settings) {
            localStorage.setItem('storeSettings', JSON.stringify(settings));
            // Dispatch event for listeners
            document.dispatchEvent(new CustomEvent('sharedData:settings_updated'));
        },
        update: function(key, value) {
            const settings = this.get();
            settings[key] = value;
            this.save(settings);
            return settings;
        },
        getDefaultSettings: function() {
            return {
                storeName: 'UrbanTreads',
                storeTagline: 'Step into Style',
                logo: '../assets/logo.png',
                currency: 'USD',
                taxRate: 0.08,
                freeShippingThreshold: 200,
                standardShippingRate: 9.99,
                showOutOfStockProducts: true,
                productsPerPage: 12,
                enableUserRegistration: true,
                enableReviews: true,
                enableWishlist: true,
                socialLinks: {
                    facebook: 'https://facebook.com/urbantreads',
                    instagram: 'https://instagram.com/urbantreads',
                    twitter: 'https://twitter.com/urbantreads'
                },
                contactEmail: 'support@urbantreads.com',
                contactPhone: '(555) 123-4567',
                storeAddress: '123 Fashion St, Style City, SC 12345'
            };
        }
    };
}

// Initialize sync status indicators
function initSyncStatus() {
    // Create sync status indicator if it doesn't exist
    if (!document.getElementById('syncStatus')) {
        const syncStatus = document.createElement('div');
        syncStatus.id = 'syncStatus';
        syncStatus.className = 'sync-status';
        syncStatus.innerHTML = `
            <div class="sync-indicator">
                <i class="bi bi-arrow-repeat"></i>
            </div>
            <div class="sync-message">All changes synced</div>
        `;
        document.body.appendChild(syncStatus);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .sync-status {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #fff;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 10px 15px;
                display: flex;
                align-items: center;
                font-size: 14px;
                z-index: 1000;
                transition: all 0.3s ease;
                opacity: 0;
                transform: translateY(20px);
            }
            .sync-status.show {
                opacity: 1;
                transform: translateY(0);
            }
            .sync-status.syncing .sync-indicator i {
                animation: spin 1s linear infinite;
            }
            .sync-status.success {
                background-color: #d4edda;
                color: #155724;
            }
            .sync-status.error {
                background-color: #f8d7da;
                color: #721c24;
            }
            .sync-indicator {
                margin-right: 10px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Listen for sync events
    document.addEventListener('sync:started', function() {
        showSyncStatus('syncing', 'Syncing changes...');
    });
    
    document.addEventListener('sync:completed', function() {
        showSyncStatus('success', 'All changes synced');
    });
    
    document.addEventListener('sync:error', function(e) {
        showSyncStatus('error', e.detail?.message || 'Sync failed');
    });
}

// Show sync status message
function showSyncStatus(type, message) {
    const syncStatus = document.getElementById('syncStatus');
    if (!syncStatus) return;
    
    // Reset classes
    syncStatus.classList.remove('syncing', 'success', 'error');
    
    // Add appropriate class
    if (type) {
        syncStatus.classList.add(type);
    }
    
    // Update message
    syncStatus.querySelector('.sync-message').textContent = message;
    
    // Show status
    syncStatus.classList.add('show');
    
    // Hide after delay unless syncing
    if (type !== 'syncing') {
        setTimeout(() => {
            syncStatus.classList.remove('show');
        }, 3000);
    }
}

// Sync product to store
function syncProductToStore(event) {
    document.dispatchEvent(new CustomEvent('sync:started'));
    
    try {
        const product = event.detail.product;
        
        // Save to shared repository
        if (product.id) {
            window.sharedProductsRepo.update(product);
        } else {
            window.sharedProductsRepo.create(product);
        }
        
        document.dispatchEvent(new CustomEvent('sync:completed'));
    } catch (error) {
        console.error('Error syncing product:', error);
        document.dispatchEvent(new CustomEvent('sync:error', {
            detail: { message: 'Failed to sync product' }
        }));
    }
}

// Remove product from store
function removeProductFromStore(event) {
    document.dispatchEvent(new CustomEvent('sync:started'));
    
    try {
        const productId = event.detail.productId;
        
        // Remove from shared repository
        window.sharedProductsRepo.delete(productId);
        
        document.dispatchEvent(new CustomEvent('sync:completed'));
    } catch (error) {
        console.error('Error removing product:', error);
        document.dispatchEvent(new CustomEvent('sync:error', {
            detail: { message: 'Failed to remove product' }
        }));
    }
}

// Sync order to store
function syncOrderToStore(event) {
    document.dispatchEvent(new CustomEvent('sync:started'));
    
    try {
        const order = event.detail.order;
        
        // Save to shared repository
        if (order.id) {
            window.sharedOrdersRepo.update(order);
        } else {
            window.sharedOrdersRepo.create(order);
        }
        
        document.dispatchEvent(new CustomEvent('sync:completed'));
    } catch (error) {
        console.error('Error syncing order:', error);
        document.dispatchEvent(new CustomEvent('sync:error', {
            detail: { message: 'Failed to sync order' }
        }));
    }
}

// Notify customer of order update
function notifyCustomerOrderUpdate(event) {
    document.dispatchEvent(new CustomEvent('sync:started'));
    
    try {
        const { orderId, status, order } = event.detail;
        
        // In a real application, this would send an email or push notification
        // For this demo, we'll just save a notification in localStorage
        
        // Get notifications array or create new one
        const notifications = JSON.parse(localStorage.getItem('customerNotifications')) || {};
        
        // Create customer notification array if it doesn't exist
        if (!notifications[order.customer.email]) {
            notifications[order.customer.email] = [];
        }
        
        // Add notification
        notifications[order.customer.email].push({
            type: 'order_status',
            orderId: orderId,
            status: status,
            message: `Your order #${orderId} is now ${status}`,
            date: new Date().toISOString(),
            read: false
        });
        
        // Save notifications
        localStorage.setItem('customerNotifications', JSON.stringify(notifications));
        
        document.dispatchEvent(new CustomEvent('sync:completed'));
    } catch (error) {
        console.error('Error notifying customer:', error);
        document.dispatchEvent(new CustomEvent('sync:error', {
            detail: { message: 'Failed to notify customer' }
        }));
    }
}

// Sync customer to store
function syncCustomerToStore(event) {
    document.dispatchEvent(new CustomEvent('sync:started'));
    
    try {
        const customer = event.detail.customer;
        
        // Save to shared repository
        if (customer.id) {
            window.sharedCustomersRepo.update(customer);
        } else {
            window.sharedCustomersRepo.create(customer);
        }
        
        document.dispatchEvent(new CustomEvent('sync:completed'));
    } catch (error) {
        console.error('Error syncing customer:', error);
        document.dispatchEvent(new CustomEvent('sync:error', {
            detail: { message: 'Failed to sync customer' }
        }));
    }
}

// Sync settings to store
function syncSettingsToStore(event) {
    document.dispatchEvent(new CustomEvent('sync:started'));
    
    try {
        const settings = event.detail.settings;
        
        // Save to shared repository
        window.sharedSettingsRepo.save(settings);
        
        document.dispatchEvent(new CustomEvent('sync:completed'));
    } catch (error) {
        console.error('Error syncing settings:', error);
        document.dispatchEvent(new CustomEvent('sync:error', {
            detail: { message: 'Failed to sync settings' }
        }));
    }
}

// Get user authentication status and permissions
function getUserAuth() {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const admin = JSON.parse(localStorage.getItem('admin')) || {};
    
    return {
        isLoggedIn: user.isLoggedIn || admin.isLoggedIn,
        isAdmin: admin.isLoggedIn || false,
        userId: user.id || null,
        adminId: admin.id || null,
        email: user.email || admin.email || null,
        name: user.name || admin.name || null
    };
}

// Check if user has admin permissions
function hasAdminPermission() {
    const auth = getUserAuth();
    return auth.isAdmin;
}

// Redirect to appropriate dashboard based on user role
function redirectToDashboard() {
    const auth = getUserAuth();
    
    if (auth.isAdmin) {
        window.location.href = '../admin/index.html';
    } else if (auth.isLoggedIn) {
        window.location.href = '../html/account.html';
    } else {
        window.location.href = '../html/login.html';
    }
}