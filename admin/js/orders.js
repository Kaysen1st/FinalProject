// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin || !admin.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize orders page
    initOrdersPage();
});

// Initialize orders page
function initOrdersPage() {
    // Load orders
    loadOrders();
    
    // Initialize order stats
    updateOrderStats();
    
    // Initialize order filters
    initOrderFilters();
    
    // Initialize order details modal
    initOrderDetailsModal();
    
    // Initialize create order form
    initCreateOrderForm();
}

// Load orders
function loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    const orderCount = document.getElementById('orderCount');
    
    if (!ordersTable) return;
    
    // Get orders from localStorage or use sample data if none exists
    let orders = JSON.parse(localStorage.getItem('orders')) || getSampleOrders();
    
    // Save sample orders to localStorage if none exist
    if (!localStorage.getItem('orders')) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // Update order count
    if (orderCount) orderCount.textContent = orders.length;
    
    // Generate HTML for orders
    let ordersHTML = '';
    
    if (orders.length === 0) {
        ordersHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">No orders found</td>
            </tr>
        `;
    } else {
        orders.forEach(order => {
            // Format date
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Get status badge class
            let statusBadgeClass = '';
            switch (order.status) {
                case 'new':
                    statusBadgeClass = 'bg-primary';
                    break;
                case 'processing':
                    statusBadgeClass = 'bg-warning';
                    break;
                case 'shipped':
                    statusBadgeClass = 'bg-info';
                    break;
                case 'delivered':
                    statusBadgeClass = 'bg-success';
                    break;
                case 'cancelled':
                    statusBadgeClass = 'bg-danger';
                    break;
            }
            
            // Get payment badge class
            let paymentBadgeClass = '';
            switch (order.paymentMethod) {
                case 'credit_card':
                    paymentBadgeClass = 'bg-success';
                    break;
                case 'paypal':
                    paymentBadgeClass = 'bg-primary';
                    break;
                case 'apple_pay':
                    paymentBadgeClass = 'bg-dark';
                    break;
                case 'cash_on_delivery':
                    paymentBadgeClass = 'bg-secondary';
                    break;
            }
            
            // Format payment method display name
            let paymentMethodDisplay = '';
            switch (order.paymentMethod) {
                case 'credit_card':
                    paymentMethodDisplay = 'Credit Card';
                    break;
                case 'paypal':
                    paymentMethodDisplay = 'PayPal';
                    break;
                case 'apple_pay':
                    paymentMethodDisplay = 'Apple Pay';
                    break;
                case 'cash_on_delivery':
                    paymentMethodDisplay = 'Cash on Delivery';
                    break;
                default:
                    paymentMethodDisplay = order.paymentMethod;
            }
            
            ordersHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer.firstName} ${order.customer.lastName}</td>
                    <td>${formattedDate}</td>
                    <td>${order.items.length}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td><span class="badge ${statusBadgeClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td><span class="badge ${paymentBadgeClass}">${paymentMethodDisplay}</span></td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary view-order" data-id="${order.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary print-order" data-id="${order.id}">
                                <i class="bi bi-printer"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    ordersTable.innerHTML = ordersHTML;
    
    // Add event listeners to order actions
    addOrderActionListeners();
}

// Update order stats
function updateOrderStats() {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Count orders by status
    const newOrdersCount = orders.filter(order => order.status === 'new').length;
    const processingOrdersCount = orders.filter(order => order.status === 'processing').length;
    const shippedOrdersCount = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrdersCount = orders.filter(order => order.status === 'delivered').length;
    
    // Update stats in UI
    document.querySelector('.new-orders-count').textContent = newOrdersCount;
    document.querySelector('.processing-orders-count').textContent = processingOrdersCount;
    document.querySelector('.shipped-orders-count').textContent = shippedOrdersCount;
    document.querySelector('.delivered-orders-count').textContent = deliveredOrdersCount;
}

// Initialize order filters
function initOrderFilters() {
    const orderSearch = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const resetOrderFilters = document.getElementById('resetOrderFilters');
    const customDateRange = document.querySelector('.custom-date-range');
    
    // Show/hide custom date range inputs
    if (dateRangeFilter && customDateRange) {
        dateRangeFilter.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.classList.remove('d-none');
            } else {
                customDateRange.classList.add('d-none');
            }
            
            applyOrderFilters();
        });
    }
    
    // Search filter
    if (orderSearch) {
        orderSearch.addEventListener('input', applyOrderFilters);
    }
    
    // Status filter
    if (statusFilter) {
        statusFilter.addEventListener('change', applyOrderFilters);
    }
    
    // Date inputs
    if (startDate && endDate) {
        startDate.addEventListener('change', applyOrderFilters);
        endDate.addEventListener('change', applyOrderFilters);
    }
    
    // Reset filters
    if (resetOrderFilters) {
        resetOrderFilters.addEventListener('click', function() {
            if (orderSearch) orderSearch.value = '';
            if (statusFilter) statusFilter.value = '';
            if (dateRangeFilter) dateRangeFilter.value = '';
            if (startDate) startDate.value = '';
            if (endDate) endDate.value = '';
            if (customDateRange) customDateRange.classList.add('d-none');
            
            applyOrderFilters();
        });
    }
}

// Apply filters to orders
function applyOrderFilters() {
    const ordersTable = document.getElementById('ordersTable');
    const orderCount = document.getElementById('orderCount');
    const orderSearch = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (!ordersTable) return;
    
    // Get orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Apply search filter
    if (orderSearch && orderSearch.value) {
        const searchTerm = orderSearch.value.toLowerCase();
        orders = orders.filter(order => 
            order.id.toLowerCase().includes(searchTerm) ||
            `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(searchTerm) ||
            order.customer.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (statusFilter && statusFilter.value) {
        orders = orders.filter(order => order.status === statusFilter.value);
    }
    
    // Apply date filter
    if (dateRangeFilter && dateRangeFilter.value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
        
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        
        switch (dateRangeFilter.value) {
            case 'today':
                orders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= today;
                });
                break;
            case 'yesterday':
                orders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= yesterday && orderDate < today;
                });
                break;
            case 'week':
                orders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= thisWeekStart;
                });
                break;
            case 'month':
                orders = orders.filter(order => {
                    const orderDate = new Date(order.date);
                    return orderDate >= thisMonthStart;
                });
                break;
            case 'custom':
                if (startDate && startDate.value) {
                    const startDateObj = new Date(startDate.value);
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate >= startDateObj;
                    });
                }
                
                if (endDate && endDate.value) {
                    const endDateObj = new Date(endDate.value);
                    endDateObj.setHours(23, 59, 59, 999);
                    orders = orders.filter(order => {
                        const orderDate = new Date(order.date);
                        return orderDate <= endDateObj;
                    });
                }
                break;
        }
    }
    
    // Update order count
    if (orderCount) orderCount.textContent = orders.length;
    
    // Generate HTML for filtered orders
    let ordersHTML = '';
    
    if (orders.length === 0) {
        ordersHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">No orders found</td>
            </tr>
        `;
    } else {
        orders.forEach(order => {
            // Format date
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Get status badge class
            let statusBadgeClass = '';
            switch (order.status) {
                case 'new':
                    statusBadgeClass = 'bg-primary';
                    break;
                case 'processing':
                    statusBadgeClass = 'bg-warning';
                    break;
                case 'shipped':
                    statusBadgeClass = 'bg-info';
                    break;
                case 'delivered':
                    statusBadgeClass = 'bg-success';
                    break;
                case 'cancelled':
                    statusBadgeClass = 'bg-danger';
                    break;
            }
            
            // Get payment badge class
            let paymentBadgeClass = '';
            switch (order.paymentMethod) {
                case 'credit_card':
                    paymentBadgeClass = 'bg-success';
                    break;
                case 'paypal':
                    paymentBadgeClass = 'bg-primary';
                    break;
                case 'apple_pay':
                    paymentBadgeClass = 'bg-dark';
                    break;
                case 'cash_on_delivery':
                    paymentBadgeClass = 'bg-secondary';
                    break;
            }
            
            // Format payment method display name
            let paymentMethodDisplay = '';
            switch (order.paymentMethod) {
                case 'credit_card':
                    paymentMethodDisplay = 'Credit Card';
                    break;
                case 'paypal':
                    paymentMethodDisplay = 'PayPal';
                    break;
                case 'apple_pay':
                    paymentMethodDisplay = 'Apple Pay';
                    break;
                case 'cash_on_delivery':
                    paymentMethodDisplay = 'Cash on Delivery';
                    break;
                default:
                    paymentMethodDisplay = order.paymentMethod;
            }
            
            ordersHTML += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer.firstName} ${order.customer.lastName}</td>
                    <td>${formattedDate}</td>
                    <td>${order.items.length}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td><span class="badge ${statusBadgeClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    <td><span class="badge ${paymentBadgeClass}">${paymentMethodDisplay}</span></td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary view-order" data-id="${order.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary print-order" data-id="${order.id}">
                                <i class="bi bi-printer"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    ordersTable.innerHTML = ordersHTML;
    
    // Add event listeners to order actions
    addOrderActionListeners();
}

// Initialize order details modal
function initOrderDetailsModal() {
    // Add event listener to update status buttons
    document.querySelectorAll('.update-status').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const status = this.getAttribute('data-status');
            const orderId = document.getElementById('detailsOrderId').textContent;
            
            updateOrderStatus(orderId, status);
        });
    });
    
    // Add event listener to add note button
    const addOrderNoteBtn = document.getElementById('addOrderNote');
    if (addOrderNoteBtn) {
        addOrderNoteBtn.addEventListener('click', function() {
            const noteInput = document.getElementById('newOrderNote');
            const note = noteInput.value.trim();
            
            if (!note) return;
            
            const orderId = document.getElementById('detailsOrderId').textContent;
            addOrderNote(orderId, note);
            
            // Clear input
            noteInput.value = '';
        });
    }
    
    // Add event listener to print invoice button
    const printInvoiceBtn = document.getElementById('printInvoice');
    if (printInvoiceBtn) {
        printInvoiceBtn.addEventListener('click', function() {
            const orderId = document.getElementById('detailsOrderId').textContent;
            printOrderInvoice(orderId);
        });
    }
}

// Initialize create order form
function initCreateOrderForm() {
    const createOrderForm = document.getElementById('createOrderForm');
    const sameAsBilling = document.getElementById('sameAsBilling');
    const billingAddressFields = document.getElementById('billingAddressFields');
    const customerSelect = document.getElementById('customerSelect');
    const newCustomerFields = document.getElementById('newCustomerFields');
    const addOrderItemBtn = document.getElementById('addOrderItem');
    const saveOrderBtn = document.getElementById('saveOrder');
    
    // Toggle billing address fields
    if (sameAsBilling && billingAddressFields) {
        sameAsBilling.addEventListener('change', function() {
            if (this.checked) {
                billingAddressFields.classList.add('d-none');
            } else {
                billingAddressFields.classList.remove('d-none');
            }
        });
    }
    
    // Toggle customer fields
    if (customerSelect && newCustomerFields) {
        // Load existing customers
        loadCustomersToSelect();
        
        customerSelect.addEventListener('change', function() {
            if (this.value) {
                newCustomerFields.classList.add('d-none');
                
                // Load customer data
                const customers = JSON.parse(localStorage.getItem('customers')) || [];
                const customer = customers.find(c => c.id === parseInt(this.value));
                
                if (customer) {
                    // Fill in customer details
                    document.getElementById('customerFirstName').value = customer.firstName;
                    document.getElementById('customerLastName').value = customer.lastName;
                    document.getElementById('customerEmail').value = customer.email;
                    document.getElementById('customerPhone').value = customer.phone || '';
                    
                    // Fill in shipping address if available
                    if (customer.address) {
                        document.getElementById('shippingAddress').value = customer.address.street || '';
                        document.getElementById('shippingCity').value = customer.address.city || '';
                        document.getElementById('shippingState').value = customer.address.state || '';
                        document.getElementById('shippingZip').value = customer.address.zip || '';
                        document.getElementById('shippingCountry').value = customer.address.country || '';
                    }
                }
            } else {
                newCustomerFields.classList.remove('d-none');
                
                // Clear customer fields
                document.getElementById('customerFirstName').value = '';
                document.getElementById('customerLastName').value = '';
                document.getElementById('customerEmail').value = '';
                document.getElementById('customerPhone').value = '';
                document.getElementById('shippingAddress').value = '';
                document.getElementById('shippingCity').value = '';
                document.getElementById('shippingState').value = '';
                document.getElementById('shippingZip').value = '';
                document.getElementById('shippingCountry').value = '';
            }
        });
    }
    
    // Add order item
    if (addOrderItemBtn) {
        addOrderItemBtn.addEventListener('click', function() {
            const orderItemsTable = document.getElementById('orderItemsTable').querySelector('tbody');
            
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>
                    <select class="form-select product-select">
                        <option value="">Select Product</option>
                    </select>
                </td>
                <td>
                    <select class="form-select size-select">
                        <option value="">Select Size</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="form-control product-price" readonly>
                </td>
                <td>
                    <input type="number" class="form-control product-quantity" min="1" value="1">
                </td>
                <td>
                    <input type="text" class="form-control product-total" readonly>
                </td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-danger remove-item">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            orderItemsTable.appendChild(newRow);
            
            // Load products to select
            loadProductsToSelect(newRow.querySelector('.product-select'));
            
            // Add event listeners to the new row
            addOrderItemListeners(newRow);
        });
    }
    
    // Load products to existing rows
    document.querySelectorAll('.product-select').forEach(select => {
        loadProductsToSelect(select);
    });
    
    // Add event listeners to existing rows
    document.querySelectorAll('#orderItemsTable tbody tr').forEach(row => {
        addOrderItemListeners(row);
    });
    
    // Save order
    if (saveOrderBtn) {
        saveOrderBtn.addEventListener('click', function() {
            // Validate form
            if (!createOrderForm.checkValidity()) {
                createOrderForm.reportValidity();
                return;
            }
            
            // Check if there are items in the order
            const orderItems = document.querySelectorAll('.product-select');
            let hasItems = false;
            
            orderItems.forEach(select => {
                if (select.value) hasItems = true;
            });
            
            if (!hasItems) {
                showNotification('Please add at least one item to the order', 'error');
                return;
            }
            
            // Create order object
            const order = createOrderObject();
            
            // Save order to localStorage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Update product stock
            updateProductStock(order.items);
            
            // Save customer if new
            saveCustomerIfNew(order.customer);
            
            // Show success message
            showNotification('Order created successfully', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createOrderModal'));
            modal.hide();
            
            // Reload orders
            loadOrders();
            
            // Update order stats
            updateOrderStats();
            
            // Reset form
            createOrderForm.reset();
            document.getElementById('orderItemsTable').querySelector('tbody').innerHTML = `
                <tr>
                    <td>
                        <select class="form-select product-select">
                            <option value="">Select Product</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select size-select">
                            <option value="">Select Size</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" class="form-control product-price" readonly>
                    </td>
                    <td>
                        <input type="number" class="form-control product-quantity" min="1" value="1">
                    </td>
                    <td>
                        <input type="text" class="form-control product-total" readonly>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline-danger remove-item">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            
            // Load products to select
            loadProductsToSelect(document.querySelector('.product-select'));
            
            // Add event listeners to the row
            addOrderItemListeners(document.querySelector('#orderItemsTable tbody tr'));
        });
    }
}

// Add event listeners to order items
function addOrderItemListeners(row) {
    const productSelect = row.querySelector('.product-select');
    const sizeSelect = row.querySelector('.size-select');
    const priceInput = row.querySelector('.product-price');
    const quantityInput = row.querySelector('.product-quantity');
    const totalInput = row.querySelector('.product-total');
    const removeItemBtn = row.querySelector('.remove-item');
    
    // Product select change
    if (productSelect) {
        productSelect.addEventListener('change', function() {
            if (this.value) {
                // Get product details
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const product = products.find(p => p.id === parseInt(this.value));
                
                if (product) {
                    // Set price
                    priceInput.value = `$${product.price.toFixed(2)}`;
                    
                    // Calculate total
                    const quantity = parseInt(quantityInput.value);
                    totalInput.value = `$${(product.price * quantity).toFixed(2)}`;
                    
                    // Load sizes
                    loadProductSizes(product, sizeSelect);
                    
                    // Update order summary
                    updateOrderSummary();
                }
            } else {
                // Clear fields
                priceInput.value = '';
                totalInput.value = '';
                sizeSelect.innerHTML = '<option value="">Select Size</option>';
                
                // Update order summary
                updateOrderSummary();
            }
        });
    }
    
    // Quantity input change
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            if (productSelect.value) {
                // Get product details
                const products = JSON.parse(localStorage.getItem('products')) || [];
                const product = products.find(p => p.id === parseInt(productSelect.value));
                
                if (product) {
                    // Calculate total
                    const quantity = parseInt(this.value);
                    totalInput.value = `$${(product.price * quantity).toFixed(2)}`;
                    
                    // Update order summary
                    updateOrderSummary();
                }
            }
        });
    }
    
    // Remove item button
    if (removeItemBtn) {
        removeItemBtn.addEventListener('click', function() {
            // Check if this is the only row
            const rows = document.querySelectorAll('#orderItemsTable tbody tr');
            if (rows.length === 1) {
                // Clear fields instead of removing
                productSelect.value = '';
                sizeSelect.innerHTML = '<option value="">Select Size</option>';
                priceInput.value = '';
                quantityInput.value = '1';
                totalInput.value = '';
                
                // Update order summary
                updateOrderSummary();
            } else {
                // Remove row
                row.remove();
                
                // Update order summary
                updateOrderSummary();
            }
        });
    }
}

// Load products to select
function loadProductsToSelect(select) {
    if (!select) return;
    
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Clear current options (except the first one)
    select.innerHTML = '<option value="">Select Product</option>';
    
    // Add product options
    products.forEach(product => {
        if (product.isActive !== false && product.stock > 0) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            select.appendChild(option);
        }
    });
}

// Load customers to select
function loadCustomersToSelect() {
    const select = document.getElementById('customerSelect');
    if (!select) return;
    
    // Get customers from localStorage
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Clear current options (except the first one)
    select.innerHTML = '<option value="">Create New Customer</option>';
    
    // Add customer options
    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.firstName} ${customer.lastName} (${customer.email})`;
        select.appendChild(option);
    });
}

// Load product sizes
function loadProductSizes(product, select) {
    if (!select) return;
    
    // Clear current options
    select.innerHTML = '<option value="">Select Size</option>';
    
    // Add size options
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            select.appendChild(option);
        });
    }
}

// Update order summary
function updateOrderSummary() {
    const orderSubtotal = document.getElementById('orderSubtotal');
    const orderShipping = document.getElementById('orderShipping');
    const orderTax = document.getElementById('orderTax');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!orderSubtotal || !orderShipping || !orderTax || !orderTotal) return;
    
    // Calculate subtotal
    let subtotal = 0;
    document.querySelectorAll('.product-total').forEach(input => {
        if (input.value) {
            subtotal += parseFloat(input.value.replace('$', ''));
        }
    });
    
    // Calculate shipping (free for orders over $200)
    const shipping = subtotal > 0 ? (subtotal >= 200 ? 0 : 9.99) : 0;
    
    // Calculate tax (8%)
    const tax = subtotal * 0.08;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update summary
    orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    orderShipping.textContent = `$${shipping.toFixed(2)}`;
    orderTax.textContent = `$${tax.toFixed(2)}`;
    orderTotal.textContent = `$${total.toFixed(2)}`;
}

// Create order object
function createOrderObject() {
    // Generate order ID
    const orderId = 'UT' + Date.now().toString().substring(5);
    
    // Get customer information
    const firstName = document.getElementById('customerFirstName').value;
    const lastName = document.getElementById('customerLastName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    
    // Get shipping address
    const shippingAddress = {
        street: document.getElementById('shippingAddress').value,
        city: document.getElementById('shippingCity').value,
        state: document.getElementById('shippingState').value,
        zip: document.getElementById('shippingZip').value,
        country: document.getElementById('shippingCountry').value
    };
    
    // Get billing address
    let billingAddress;
    if (document.getElementById('sameAsBilling').checked) {
        billingAddress = { ...shippingAddress };
    } else {
        billingAddress = {
            street: document.getElementById('billingAddress').value,
            city: document.getElementById('billingCity').value,
            state: document.getElementById('billingState').value,
            zip: document.getElementById('billingZip').value,
            country: document.getElementById('billingCountry').value
        };
    }
    
    // Get order items
    const items = [];
    document.querySelectorAll('#orderItemsTable tbody tr').forEach(row => {
        const productSelect = row.querySelector('.product-select');
        const sizeSelect = row.querySelector('.size-select');
        const quantityInput = row.querySelector('.product-quantity');
        
        if (productSelect.value) {
            // Get product details
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === parseInt(productSelect.value));
            
            if (product) {
                items.push({
                    productId: product.id,
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    size: sizeSelect.value || null,
                    quantity: parseInt(quantityInput.value),
                    image: product.image
                });
            }
        }
    });
    
    // Calculate order totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 200 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    // Get payment method and status
    const paymentMethod = document.getElementById('paymentMethod').value;
    const status = document.getElementById('orderStatus').value;
    
    // Get order notes
    const notes = [];
    const orderNotes = document.getElementById('orderNotes').value.trim();
    if (orderNotes) {
        notes.push({
            text: orderNotes,
            date: new Date().toISOString(),
            user: 'Admin'
        });
    }
    
    // Create order object
    return {
        id: orderId,
        date: new Date().toISOString(),
        customer: {
            id: document.getElementById('customerSelect').value || null,
            firstName,
            lastName,
            email,
            phone
        },
        shippingAddress,
        billingAddress,
        items,
        subtotal,
        shipping,
        tax,
        total,
        paymentMethod,
        status,
        notes
    };
}

// Update product stock
function updateProductStock(orderItems) {
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Update stock for each ordered item
    orderItems.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
            products[productIndex].stock -= item.quantity;
            products[productIndex].sales = (products[productIndex].sales || 0) + item.quantity;
            products[productIndex].revenue = (products[productIndex].revenue || 0) + (item.price * item.quantity);
        }
    });
    
    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
}

// Save customer if new
function saveCustomerIfNew(customer) {
    // If customer has an ID, they already exist
    if (customer.id) return;
    
    // Get customers from localStorage
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Create new customer
    const newCustomer = {
        id: Date.now(),
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.shippingAddress,
        dateAdded: new Date().toISOString()
    };
    
    // Add customer to list
    customers.push(newCustomer);
    
    // Save updated customers to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
}

// Add event listeners to order actions
function addOrderActionListeners() {
    // View order
    document.querySelectorAll('.view-order').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            viewOrderDetails(orderId);
        });
    });
    
    // Print order
    document.querySelectorAll('.print-order').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-id');
            printOrderInvoice(orderId);
        });
    });
}

// View order details
function viewOrderDetails(orderId) {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find order by ID
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Fill order details modal
    document.getElementById('detailsOrderId').textContent = order.id;
    
    // Format date
    const orderDate = new Date(order.date);
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('detailsOrderDate').textContent = formattedDate;
    
    // Set status with badge
    let statusBadgeClass = '';
    switch (order.status) {
        case 'new':
            statusBadgeClass = 'bg-primary';
            break;
        case 'processing':
            statusBadgeClass = 'bg-warning';
            break;
        case 'shipped':
            statusBadgeClass = 'bg-info';
            break;
        case 'delivered':
            statusBadgeClass = 'bg-success';
            break;
        case 'cancelled':
            statusBadgeClass = 'bg-danger';
            break;
    }
    document.getElementById('detailsOrderStatus').innerHTML = `<span class="badge ${statusBadgeClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>`;
    
    // Format payment method
    let paymentMethodDisplay = '';
    switch (order.paymentMethod) {
        case 'credit_card':
            paymentMethodDisplay = 'Credit Card';
            break;
        case 'paypal':
            paymentMethodDisplay = 'PayPal';
            break;
        case 'apple_pay':
            paymentMethodDisplay = 'Apple Pay';
            break;
        case 'cash_on_delivery':
            paymentMethodDisplay = 'Cash on Delivery';
            break;
        default:
            paymentMethodDisplay = order.paymentMethod;
    }
    document.getElementById('detailsOrderPayment').textContent = paymentMethodDisplay;
    
    // Customer information
    document.getElementById('detailsCustomerName').textContent = `${order.customer.firstName} ${order.customer.lastName}`;
    document.getElementById('detailsCustomerEmail').textContent = order.customer.email;
    document.getElementById('detailsCustomerPhone').textContent = order.customer.phone || 'N/A';
    
    // Shipping address
    document.getElementById('detailsShippingAddress').innerHTML = `
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
        ${order.shippingAddress.country}
    `;
    
    // Billing address
    document.getElementById('detailsBillingAddress').innerHTML = `
        ${order.billingAddress.street}<br>
        ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zip}<br>
        ${order.billingAddress.country}
    `;
    
    // Order items
    let orderItemsHTML = '';
    order.items.forEach(item => {
        orderItemsHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" alt="${item.name}" width="40" height="40" class="me-2" style="object-fit: cover; border-radius: 4px;">
                        <div>
                            <div>${item.name}</div>
                            <small class="text-muted">${item.brand}</small>
                        </div>
                    </div>
                </td>
                <td>${item.size || 'N/A'}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td class="text-end">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `;
    });
    document.getElementById('detailsOrderItems').innerHTML = orderItemsHTML;
    
    // Order totals
    document.getElementById('detailsSubtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    document.getElementById('detailsShipping').textContent = `$${order.shipping.toFixed(2)}`;
    document.getElementById('detailsTax').textContent = `$${order.tax.toFixed(2)}`;
    document.getElementById('detailsTotal').textContent = `$${order.total.toFixed(2)}`;
    
    // Order notes
    const orderNotesList = document.getElementById('orderNotesList');
    if (order.notes && order.notes.length > 0) {
        let notesHTML = '';
        order.notes.forEach(note => {
            const noteDate = new Date(note.date);
            const formattedNoteDate = noteDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            notesHTML += `
                <div class="order-note">
                    <div class="order-note-meta">
                        <span class="note-author">${note.user}</span>
                        <span class="note-date">${formattedNoteDate}</span>
                    </div>
                    <p class="mb-0">${note.text}</p>
                </div>
            `;
        });
        orderNotesList.innerHTML = notesHTML;
    } else {
        orderNotesList.innerHTML = '<p class="text-muted">No notes for this order.</p>';
    }
    
    // Show modal
    const orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
    orderDetailsModal.show();
}

// Update order status
function updateOrderStatus(orderId, status) {
    // Get orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find order by ID
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    // Update status
    orders[orderIndex].status = status;
    
    // Add status change note
    const statusNote = {
        text: `Order status changed to ${status}`,
        date: new Date().toISOString(),
        user: 'Admin'
    };
    
    if (!orders[orderIndex].notes) {
        orders[orderIndex].notes = [];
    }
    
    orders[orderIndex].notes.push(statusNote);
    
    // Save updated orders to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Update order details modal
    let statusBadgeClass = '';
    switch (status) {
        case 'new':
            statusBadgeClass = 'bg-primary';
            break;
        case 'processing':
            statusBadgeClass = 'bg-warning';
            break;
        case 'shipped':
            statusBadgeClass = 'bg-info';
            break;
        case 'delivered':
            statusBadgeClass = 'bg-success';
            break;
        case 'cancelled':
            statusBadgeClass = 'bg-danger';
            break;
    }
    document.getElementById('detailsOrderStatus').innerHTML = `<span class="badge ${statusBadgeClass}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>`;
    
    // Update order notes
    const orderNotesList = document.getElementById('orderNotesList');
    let notesHTML = '';
    orders[orderIndex].notes.forEach(note => {
        const noteDate = new Date(note.date);
        const formattedNoteDate = noteDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        notesHTML += `
            <div class="order-note">
                <div class="order-note-meta">
                    <span class="note-author">${note.user}</span>
                    <span class="note-date">${formattedNoteDate}</span>
                </div>
                <p class="mb-0">${note.text}</p>
            </div>
        `;
    });
    orderNotesList.innerHTML = notesHTML;
    
    // Show success message
    showNotification(`Order status updated to ${status}`, 'success');
    
    // Reload orders
    loadOrders();
    
    // Update order stats
    updateOrderStats();
}

// Add order note
function addOrderNote(orderId, note) {
    // Get orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find order by ID
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    // Create note object
    const noteObj = {
        text: note,
        date: new Date().toISOString(),
        user: 'Admin'
    };
    
    // Add note to order
    if (!orders[orderIndex].notes) {
        orders[orderIndex].notes = [];
    }
    
    orders[orderIndex].notes.push(noteObj);
    
    // Save updated orders to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Update order notes in modal
    const orderNotesList = document.getElementById('orderNotesList');
    let notesHTML = '';
    orders[orderIndex].notes.forEach(note => {
        const noteDate = new Date(note.date);
        const formattedNoteDate = noteDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        notesHTML += `
            <div class="order-note">
                <div class="order-note-meta">
                    <span class="note-author">${note.user}</span>
                    <span class="note-date">${formattedNoteDate}</span>
                </div>
                <p class="mb-0">${note.text}</p>
            </div>
        `;
    });
    orderNotesList.innerHTML = notesHTML;
    
    // Show success message
    showNotification('Note added successfully', 'success');
}

// Print order invoice
function printOrderInvoice(orderId) {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find order by ID
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Create invoice HTML
    const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice #${order.id}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .invoice-header h1 {
                    margin: 0;
                    color: #3a5dff;
                }
                .row {
                    display: flex;
                    margin-bottom: 20px;
                }
                .col {
                    flex: 1;
                    padding: 0 15px;
                }
                .invoice-details {
                    margin-bottom: 40px;
                }
                .invoice-details table {
                    width: 100%;
                }
                .invoice-details th, .invoice-details td {
                    padding: 10px;
                    text-align: left;
                }
                .invoice-items {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                .invoice-items th, .invoice-items td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                }
                .invoice-items th {
                    background-color: #f8f9fa;
                }
                .text-right {
                    text-align: right;
                }
                .total-row {
                    font-weight: bold;
                }
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    color: #6c757d;
                    font-size: 14px;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>UrbanTreads</h1>
                <p>123 Fashion Street, Style City, SC 12345</p>
                <h2>INVOICE</h2>
            </div>
            
            <div class="row invoice-details">
                <div class="col">
                    <h3>Bill To:</h3>
                    <p>
                        ${order.customer.firstName} ${order.customer.lastName}<br>
                        ${order.billingAddress.street}<br>
                        ${order.billingAddress.city}, ${order.billingAddress.state} ${order.billingAddress.zip}<br>
                        ${order.billingAddress.country}
                    </p>
                </div>
                <div class="col">
                    <h3>Ship To:</h3>
                    <p>
                        ${order.customer.firstName} ${order.customer.lastName}<br>
                        ${order.shippingAddress.street}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                        ${order.shippingAddress.country}
                    </p>
                </div>
                <div class="col">
                    <table>
                        <tr>
                            <th>Invoice #:</th>
                            <td>${order.id}</td>
                        </tr>
                        <tr>
                            <th>Date:</th>
                            <td>${new Date(order.date).toLocaleDateString('en-US')}</td>
                        </tr>
                        <tr>
                            <th>Status:</th>
                            <td>${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</td>
                        </tr>
                        <tr>
                            <th>Payment Method:</th>
                            <td>${order.paymentMethod.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <table class="invoice-items">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Size</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>
                                ${item.name}<br>
                                <small>${item.brand}</small>
                            </td>
                            <td>${item.size || 'N/A'}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td class="text-right">$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-right">Subtotal:</td>
                        <td class="text-right">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-right">Shipping:</td>
                        <td class="text-right">$${order.shipping.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="text-right">Tax:</td>
                        <td class="text-right">$${order.tax.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="4" class="text-right">Total:</td>
                        <td class="text-right">$${order.total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
            
            <div class="footer">
                <p>Thank you for shopping with UrbanTreads!</p>
                <p>If you have any questions about this invoice, please contact us at support@urbantreads.com</p>
            </div>
            
            <div class="no-print" style="text-align: center; margin-top: 30px;">
                <button onclick="window.print();" style="padding: 10px 20px; background-color: #3a5dff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Print Invoice
                </button>
                <button onclick="window.close();" style="padding: 10px 20px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
                    Close
                </button>
            </div>
        </body>
        </html>
    `;
    
    // Open new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Wait for resources to load then print
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

// Get sample orders
function getSampleOrders() {
    return [
        {
            id: 'UT12345678',
            date: '2023-06-15T10:30:00Z',
            customer: {
                id: 1,
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@example.com',
                phone: '(555) 123-4567'
            },
            shippingAddress: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            billingAddress: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            items: [
                {
                    productId: 1,
                    name: 'Air Jordan 1 Retro High OG',
                    brand: 'Jordan',
                    price: 179.99,
                    size: '10',
                    quantity: 1,
                    image: '../assets/product-1.jpg'
                },
                {
                    productId: 3,
                    name: 'Nike Dunk Low',
                    brand: 'Nike',
                    price: 129.99,
                    size: '9.5',
                    quantity: 1,
                    image: '../assets/product-3.jpg'
                }
            ],
            subtotal: 309.98,
            shipping: 0,
            tax: 24.8,
            total: 334.78,
            paymentMethod: 'credit_card',
            status: 'delivered',
            notes: [
                {
                    text: 'Order placed via website',
                    date: '2023-06-15T10:30:00Z',
                    user: 'System'
                },
                {
                    text: 'Payment confirmed',
                    date: '2023-06-15T10:35:00Z',
                    user: 'System'
                },
                {
                    text: 'Order shipped via FedEx, tracking #: FDX123456789',
                    date: '2023-06-16T14:20:00Z',
                    user: 'Admin'
                },
                {
                    text: 'Order delivered',
                    date: '2023-06-18T15:45:00Z',
                    user: 'System'
                }
            ]
        },
        {
            id: 'UT87654321',
            date: '2023-06-14T15:45:00Z',
            customer: {
                id: 2,
                firstName: 'Emily',
                lastName: 'Johnson',
                email: 'emily.johnson@example.com',
                phone: '(555) 987-6543'
            },
            shippingAddress: {
                street: '456 Park Ave',
                city: 'Los Angeles',
                state: 'CA',
                zip: '90001',
                country: 'USA'
            },
            billingAddress: {
                street: '456 Park Ave',
                city: 'Los Angeles',
                state: 'CA',
                zip: '90001',
                country: 'USA'
            },
            items: [
                {
                    productId: 2,
                    name: 'Yeezy Boost 350 V2',
                    brand: 'Adidas',
                    price: 249.99,
                    size: '8',
                    quantity: 1,
                    image: '../assets/product-2.jpg'
                }
            ],
            subtotal: 249.99,
            shipping: 0,
            tax: 20.0,
            total: 269.99,
            paymentMethod: 'paypal',
            status: 'shipped',
            notes: [
                {
                    text: 'Order placed via website',
                    date: '2023-06-14T15:45:00Z',
                    user: 'System'
                },
                {
                    text: 'Payment confirmed',
                    date: '2023-06-14T15:50:00Z',
                    user: 'System'
                },
                {
                    text: 'Order processed and ready for shipping',
                    date: '2023-06-15T09:30:00Z',
                    user: 'Admin'
                },
                {
                    text: 'Order shipped via UPS, tracking #: UPS987654321',
                    date: '2023-06-15T14:20:00Z',
                    user: 'Admin'
                }
            ]
        },
        {
            id: 'UT23456789',
            date: '2023-06-14T11:20:00Z',
            customer: {
                id: 3,
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'michael.brown@example.com',
                phone: '(555) 456-7890'
            },
            shippingAddress: {
                street: '789 Oak St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'USA'
            },
            billingAddress: {
                street: '789 Oak St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'USA'
            },
            items: [
                {
                    productId: 5,
                    name: 'Air Jordan 4 Retro',
                    brand: 'Jordan',
                    price: 209.99,
                    size: '11',
                    quantity: 1,
                    image: '../assets/product-5.jpg'
                }
            ],
            subtotal: 209.99,
            shipping: 0,
            tax: 16.8,
            total: 226.79,
            paymentMethod: 'credit_card',
            status: 'processing',
            notes: [
                {
                    text: 'Order placed via website',
                    date: '2023-06-14T11:20:00Z',
                    user: 'System'
                },
                {
                    text: 'Payment confirmed',
                    date: '2023-06-14T11:25:00Z',
                    user: 'System'
                },
                {
                    text: 'Order being processed',
                    date: '2023-06-14T14:30:00Z',
                    user: 'Admin'
                }
            ]
        },
        {
            id: 'UT34567890',
            date: '2023-06-13T09:15:00Z',
            customer: {
                id: 4,
                firstName: 'Sarah',
                lastName: 'Wilson',
                email: 'sarah.wilson@example.com',
                phone: '(555) 789-0123'
            },
            shippingAddress: {
                street: '321 Pine St',
                city: 'Miami',
                state: 'FL',
                zip: '33101',
                country: 'USA'
            },
            billingAddress: {
                street: '321 Pine St',
                city: 'Miami',
                state: 'FL',
                zip: '33101',
                country: 'USA'
            },
            items: [
                {
                    productId: 3,
                    name: 'Nike Dunk Low',
                    brand: 'Nike',
                    price: 129.99,
                    size: '7',
                    quantity: 1,
                    image: '../assets/product-3.jpg'
                }
            ],
            subtotal: 129.99,
            shipping: 9.99,
            tax: 10.4,
            total: 150.38,
            paymentMethod: 'apple_pay',
            status: 'new',
            notes: [
                {
                    text: 'Order placed via website',
                    date: '2023-06-13T09:15:00Z',
                    user: 'System'
                },
                {
                    text: 'Payment confirmed',
                    date: '2023-06-13T09:20:00Z',
                    user: 'System'
                }
            ]
        },
        {
            id: 'UT45678901',
            date: '2023-06-12T16:40:00Z',
            customer: {
                id: 5,
                firstName: 'David',
                lastName: 'Lee',
                email: 'david.lee@example.com',
                phone: '(555) 234-5678'
            },
            shippingAddress: {
                street: '654 Maple Ave',
                city: 'Seattle',
                state: 'WA',
                zip: '98101',
                country: 'USA'
            },
            billingAddress: {
                street: '654 Maple Ave',
                city: 'Seattle',
                state: 'WA',
                zip: '98101',
                country: 'USA'
            },
            items: [
                {
                    productId: 7,
                    name: 'Nike Air Force 1 Low',
                    brand: 'Nike',
                    price: 109.99,
                    size: '9',
                    quantity: 1,
                    image: '../assets/product-7.jpg'
                },
                {
                    productId: 6,
                    name: 'Adidas Forum Low',
                    brand: 'Adidas',
                    price: 99.99,
                    size: '9',
                    quantity: 1,
                    image: '../assets/product-6.jpg'
                },
                {
                    productId: 4,
                    name: 'New Balance 550',
                    brand: 'New Balance',
                    price: 119.99,
                    size: '9.5',
                    quantity: 1,
                    image: '../assets/product-4.jpg'
                }
            ],
            subtotal: 329.97,
            shipping: 0,
            tax: 26.4,
            total: 356.37,
            paymentMethod: 'credit_card',
            status: 'delivered',
            notes: [
                {
                    text: 'Order placed via website',
                    date: '2023-06-12T16:40:00Z',
                    user: 'System'
                },
                {
                    text: 'Payment confirmed',
                    date: '2023-06-12T16:45:00Z',
                    user: 'System'
                },
                {
                    text: 'Order processed and ready for shipping',
                    date: '2023-06-13T10:15:00Z',
                    user: 'Admin'
                },
                {
                    text: 'Order shipped via FedEx, tracking #: FDX567890123',
                    date: '2023-06-13T15:30:00Z',
                    user: 'Admin'
                },
                {
                    text: 'Order delivered',
                    date: '2023-06-15T11:20:00Z',
                    user: 'System'
                }
            ]
        }
    ];
}