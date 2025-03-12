// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin || !admin.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize customers page
    initCustomersPage();
});

// Initialize customers page
function initCustomersPage() {
    // Load customers
    loadCustomers();
    
    // Initialize customer filters
    initCustomerFilters();
    
    // Initialize customer form
    initCustomerForm();
}

// Load customers
function loadCustomers() {
    const customersTable = document.getElementById('customersTable');
    const customerCount = document.getElementById('customerCount');
    
    if (!customersTable) return;
    
    // Get customers from localStorage or use sample data if none exists
    let customers = JSON.parse(localStorage.getItem('customers')) || getSampleCustomers();
    
    // Save sample customers to localStorage if none exist
    if (!localStorage.getItem('customers')) {
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    
    // Update customer count
    if (customerCount) customerCount.textContent = customers.length;
    
    // Generate HTML for customers
    let customersHTML = '';
    
    if (customers.length === 0) {
        customersHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">No customers found</td>
            </tr>
        `;
    } else {
        customers.forEach(customer => {
            // Format date
            const joinDate = new Date(customer.dateAdded);
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Get orders count and total spent
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const customerOrders = orders.filter(order => 
                order.customer.email === customer.email || 
                (order.customer.id && order.customer.id === customer.id)
            );
            
            const ordersCount = customerOrders.length;
            const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
            
            customersHTML += `
                <tr>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input customer-checkbox" type="checkbox" value="${customer.id}">
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="customer-avatar me-3">
                                ${getInitials(customer.firstName, customer.lastName)}
                            </div>
                            <div>
                                <h6 class="mb-0">${customer.firstName} ${customer.lastName}</h6>
                                <small class="text-muted">${customer.email}</small>
                            </div>
                        </div>
                    </td>
                    <td>${customer.phone || 'N/A'}</td>
                    <td>${formattedDate}</td>
                    <td>${ordersCount}</td>
                    <td>$${totalSpent.toFixed(2)}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary view-customer" data-id="${customer.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary edit-customer" data-id="${customer.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger delete-customer" data-id="${customer.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    customersTable.innerHTML = customersHTML;
    
    // Add event listeners to customer actions
    addCustomerActionListeners();
}

// Initialize customer filters
function initCustomerFilters() {
    const customerSearch = document.getElementById('customerSearch');
    const dateJoinedFilter = document.getElementById('dateJoinedFilter');
    const ordersFilter = document.getElementById('ordersFilter');
    const resetCustomerFilters = document.getElementById('resetCustomerFilters');
    
    // Search filter
    if (customerSearch) {
        customerSearch.addEventListener('input', applyCustomerFilters);
    }
    
    // Date joined filter
    if (dateJoinedFilter) {
        dateJoinedFilter.addEventListener('change', applyCustomerFilters);
    }
    
    // Orders filter
    if (ordersFilter) {
        ordersFilter.addEventListener('change', applyCustomerFilters);
    }
    
    // Reset filters
    if (resetCustomerFilters) {
        resetCustomerFilters.addEventListener('click', function() {
            if (customerSearch) customerSearch.value = '';
            if (dateJoinedFilter) dateJoinedFilter.value = '';
            if (ordersFilter) ordersFilter.value = '';
            
            applyCustomerFilters();
        });
    }
}

// Apply filters to customers
function applyCustomerFilters() {
    const customersTable = document.getElementById('customersTable');
    const customerCount = document.getElementById('customerCount');
    const customerSearch = document.getElementById('customerSearch');
    const dateJoinedFilter = document.getElementById('dateJoinedFilter');
    const ordersFilter = document.getElementById('ordersFilter');
    
    if (!customersTable) return;
    
    // Get customers from localStorage
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Apply search filter
    if (customerSearch && customerSearch.value) {
        const searchTerm = customerSearch.value.toLowerCase();
        customers = customers.filter(customer => 
            `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm) ||
            (customer.phone && customer.phone.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply date joined filter
    if (dateJoinedFilter && dateJoinedFilter.value) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const last30Days = new Date(today);
        last30Days.setDate(last30Days.getDate() - 30);
        
        const last90Days = new Date(today);
        last90Days.setDate(last90Days.getDate() - 90);
        
        const lastYear = new Date(today);
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        
        switch (dateJoinedFilter.value) {
            case 'last30days':
                customers = customers.filter(customer => {
                    const joinDate = new Date(customer.dateAdded);
                    return joinDate >= last30Days;
                });
                break;
            case 'last90days':
                customers = customers.filter(customer => {
                    const joinDate = new Date(customer.dateAdded);
                    return joinDate >= last90Days;
                });
                break;
            case 'lastyear':
                customers = customers.filter(customer => {
                    const joinDate = new Date(customer.dateAdded);
                    return joinDate >= lastYear;
                });
                break;
        }
    }
    
    // Apply orders filter
    if (ordersFilter && ordersFilter.value) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        
        // Create a map of customer emails to order counts
        const customerOrderCounts = {};
        
        orders.forEach(order => {
            const email = order.customer.email;
            if (email) {
                customerOrderCounts[email] = (customerOrderCounts[email] || 0) + 1;
            }
        });
        
        switch (ordersFilter.value) {
            case 'noorders':
                customers = customers.filter(customer => 
                    !customerOrderCounts[customer.email] || customerOrderCounts[customer.email] === 0
                );
                break;
            case 'oneormore':
                customers = customers.filter(customer => 
                    customerOrderCounts[customer.email] && customerOrderCounts[customer.email] >= 1
                );
                break;
            case 'threeormore':
                customers = customers.filter(customer => 
                    customerOrderCounts[customer.email] && customerOrderCounts[customer.email] >= 3
                );
                break;
        }
    }
    
    // Update customer count
    if (customerCount) customerCount.textContent = customers.length;
    
    // Generate HTML for filtered customers
    let customersHTML = '';
    
    if (customers.length === 0) {
        customersHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">No customers found</td>
            </tr>
        `;
    } else {
        customers.forEach(customer => {
            // Format date
            const joinDate = new Date(customer.dateAdded);
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Get orders count and total spent
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            const customerOrders = orders.filter(order => 
                order.customer.email === customer.email || 
                (order.customer.id && order.customer.id === customer.id)
            );
            
            const ordersCount = customerOrders.length;
            const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
            
            customersHTML += `
                <tr>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input customer-checkbox" type="checkbox" value="${customer.id}">
                        </div>
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="customer-avatar me-3">
                                ${getInitials(customer.firstName, customer.lastName)}
                            </div>
                            <div>
                                <h6 class="mb-0">${customer.firstName} ${customer.lastName}</h6>
                                <small class="text-muted">${customer.email}</small>
                            </div>
                        </div>
                    </td>
                    <td>${customer.phone || 'N/A'}</td>
                    <td>${formattedDate}</td>
                    <td>${ordersCount}</td>
                    <td>$${totalSpent.toFixed(2)}</td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary view-customer" data-id="${customer.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary edit-customer" data-id="${customer.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger delete-customer" data-id="${customer.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    customersTable.innerHTML = customersHTML;
    
    // Add event listeners to customer actions
    addCustomerActionListeners();
}

// Initialize customer form
function initCustomerForm() {
    const customerForm = document.getElementById('customerForm');
    const saveCustomerBtn = document.getElementById('saveCustomer');
    
    if (!customerForm || !saveCustomerBtn) return;
    
    // Handle save customer
    saveCustomerBtn.addEventListener('click', function() {
        // Validate form
        if (!customerForm.checkValidity()) {
            customerForm.reportValidity();
            return;
        }
        
        // Get form values
        const customerId = document.getElementById('customerId').value;
        const firstName = document.getElementById('customerFirstName').value;
        const lastName = document.getElementById('customerLastName').value;
        const email = document.getElementById('customerEmail').value;
        const phone = document.getElementById('customerPhone').value;
        const street = document.getElementById('customerStreet').value;
        const city = document.getElementById('customerCity').value;
        const state = document.getElementById('customerState').value;
        const zip = document.getElementById('customerZip').value;
        const country = document.getElementById('customerCountry').value;
        
        // Get customers from localStorage
        let customers = JSON.parse(localStorage.getItem('customers')) || [];
        
        if (customerId) {
            // Update existing customer
            const index = customers.findIndex(c => c.id === parseInt(customerId));
            if (index !== -1) {
                customers[index] = {
                    ...customers[index],
                    firstName,
                    lastName,
                    email,
                    phone,
                    address: {
                        street,
                        city,
                        state,
                        zip,
                        country
                    }
                };
                
                showNotification('Customer updated successfully', 'success');
            }
        } else {
            // Create new customer
            const newCustomer = {
                id: Date.now(),
                firstName,
                lastName,
                email,
                phone,
                address: {
                    street,
                    city,
                    state,
                    zip,
                    country
                },
                dateAdded: new Date().toISOString()
            };
            
            customers.push(newCustomer);
            showNotification('Customer added successfully', 'success');
        }
        
        // Save customers to localStorage
        localStorage.setItem('customers', JSON.stringify(customers));
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('customerModal'));
        modal.hide();
        
        // Reload customers
        loadCustomers();
        
        // Reset form
        customerForm.reset();
        document.getElementById('customerId').value = '';
        
        // Update modal title
        const modalTitle = document.getElementById('customerModalLabel');
        if (modalTitle) {
            modalTitle.textContent = 'Add New Customer';
        }
    });
}

// Add event listeners to customer actions
function addCustomerActionListeners() {
    // View customer
    document.querySelectorAll('.view-customer').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            viewCustomer(customerId);
        });
    });
    
    // Edit customer
    document.querySelectorAll('.edit-customer').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            editCustomer(customerId);
        });
    });
    
    // Delete customer
    document.querySelectorAll('.delete-customer').forEach(button => {
        button.addEventListener('click', function() {
            const customerId = parseInt(this.getAttribute('data-id'));
            
            // Show confirmation modal
            const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteCustomerModal'));
            deleteConfirmModal.show();
            
            // Set up confirm delete button
            const confirmDelete = document.getElementById('confirmDeleteCustomer');
            if (confirmDelete) {
                confirmDelete.onclick = function() {
                    deleteCustomer(customerId);
                    deleteConfirmModal.hide();
                };
            }
        });
    });
    
    // Bulk delete
    const bulkDeleteCustomers = document.getElementById('bulkDeleteCustomers');
    const selectAllCustomers = document.getElementById('selectAllCustomers');
    
    // Select all customers
    if (selectAllCustomers) {
        selectAllCustomers.addEventListener('change', function() {
            const customerCheckboxes = document.querySelectorAll('.customer-checkbox');
            customerCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            // Enable/disable bulk delete button
            if (bulkDeleteCustomers) {
                bulkDeleteCustomers.disabled = !this.checked;
            }
        });
    }
    
    // Enable/disable bulk delete button based on selections
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('customer-checkbox')) {
            const checkedCustomers = document.querySelectorAll('.customer-checkbox:checked');
            if (bulkDeleteCustomers) {
                bulkDeleteCustomers.disabled = checkedCustomers.length === 0;
            }
            
            // Update select all checkbox
            if (selectAllCustomers) {
                const allCustomerCheckboxes = document.querySelectorAll('.customer-checkbox');
                selectAllCustomers.checked = checkedCustomers.length === allCustomerCheckboxes.length && allCustomerCheckboxes.length > 0;
                selectAllCustomers.indeterminate = checkedCustomers.length > 0 && checkedCustomers.length < allCustomerCheckboxes.length;
            }
        }
    });
    
    // Bulk delete customers
    if (bulkDeleteCustomers) {
        bulkDeleteCustomers.addEventListener('click', function() {
            const checkedCustomers = document.querySelectorAll('.customer-checkbox:checked');
            if (checkedCustomers.length === 0) return;
            
            // Show confirmation modal
            const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteCustomerModal'));
            deleteConfirmModal.show();
            
            // Set up confirm delete button
            const confirmDelete = document.getElementById('confirmDeleteCustomer');
            if (confirmDelete) {
                confirmDelete.onclick = function() {
                    const selectedIds = Array.from(checkedCustomers).map(checkbox => parseInt(checkbox.value));
                    bulkDeleteCustomers(selectedIds);
                    deleteConfirmModal.hide();
                };
            }
        });
    }
}

// View customer details
function viewCustomer(customerId) {
    // Get customers from localStorage
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Find customer by ID
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Get customer orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const customerOrders = orders.filter(order => 
        order.customer.email === customer.email || 
        (order.customer.id && order.customer.id === customer.id)
    );
    
    // Calculate total spent
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Format date
    const joinDate = new Date(customer.dateAdded);
    const formattedDate = joinDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Fill customer details modal
    document.getElementById('viewCustomerName').textContent = `${customer.firstName} ${customer.lastName}`;
    document.getElementById('viewCustomerEmail').textContent = customer.email;
    document.getElementById('viewCustomerPhone').textContent = customer.phone || 'N/A';
    document.getElementById('viewCustomerJoined').textContent = formattedDate;
    document.getElementById('viewCustomerOrders').textContent = customerOrders.length;
    document.getElementById('viewCustomerSpent').textContent = `$${totalSpent.toFixed(2)}`;
    
    // Fill address
    if (customer.address) {
        document.getElementById('viewCustomerAddress').innerHTML = `
            ${customer.address.street || ''}<br>
            ${customer.address.city || ''}, ${customer.address.state || ''} ${customer.address.zip || ''}<br>
            ${customer.address.country || ''}
        `;
    } else {
        document.getElementById('viewCustomerAddress').textContent = 'No address provided';
    }
    
    // Fill recent orders
    const recentOrdersList = document.getElementById('viewCustomerRecentOrders');
    if (customerOrders.length > 0) {
        // Sort orders by date (newest first)
        customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let ordersHTML = '';
        
        // Show up to 5 most recent orders
        const recentOrders = customerOrders.slice(0, 5);
        
        recentOrders.forEach(order => {
            // Format date
            const orderDate = new Date(order.date);
            const formattedOrderDate = orderDate.toLocaleDateString('en-US', {
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
            
            ordersHTML += `
                <div class="recent-order">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">Order #${order.id}</h6>
                            <div class="text-muted">${formattedOrderDate}</div>
                        </div>
                        <div class="text-end">
                            <div class="mb-1">$${order.total.toFixed(2)}</div>
                            <span class="badge ${statusBadgeClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        recentOrdersList.innerHTML = ordersHTML;
    } else {
        recentOrdersList.innerHTML = '<p class="text-muted">No orders found for this customer.</p>';
    }
    
    // Show modal
    const customerDetailsModal = new bootstrap.Modal(document.getElementById('viewCustomerModal'));
    customerDetailsModal.show();
}

// Edit customer
function editCustomer(customerId) {
    // Get customers from localStorage
    const customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Find customer by ID
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    // Update modal title
    const modalTitle = document.getElementById('customerModalLabel');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Customer';
    }
    
    // Fill form with customer data
    document.getElementById('customerId').value = customer.id;
    document.getElementById('customerFirstName').value = customer.firstName;
    document.getElementById('customerLastName').value = customer.lastName;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone || '';
    
    // Fill address fields if available
    if (customer.address) {
        document.getElementById('customerStreet').value = customer.address.street || '';
        document.getElementById('customerCity').value = customer.address.city || '';
        document.getElementById('customerState').value = customer.address.state || '';
        document.getElementById('customerZip').value = customer.address.zip || '';
        document.getElementById('customerCountry').value = customer.address.country || '';
    } else {
        document.getElementById('customerStreet').value = '';
        document.getElementById('customerCity').value = '';
        document.getElementById('customerState').value = '';
        document.getElementById('customerZip').value = '';
        document.getElementById('customerCountry').value = '';
    }
    
    // Show modal
    const customerModal = new bootstrap.Modal(document.getElementById('customerModal'));
    customerModal.show();
}

// Delete customer
function deleteCustomer(customerId) {
    // Get customers from localStorage
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Filter out the customer to delete
    customers = customers.filter(customer => customer.id !== customerId);
    
    // Save updated customers to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // Show success message
    showNotification('Customer deleted successfully', 'success');
    
    // Reload customers
    loadCustomers();
}

// Bulk delete customers
function bulkDeleteCustomers(customerIds) {
    // Get customers from localStorage
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Filter out the customers to delete
    customers = customers.filter(customer => !customerIds.includes(customer.id));
    
    // Save updated customers to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // Show success message
    showNotification(`${customerIds.length} customer(s) deleted successfully`, 'success');
    
    // Reload customers
    loadCustomers();
}

// Get initials from name
function getInitials(firstName, lastName) {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`;
}

// Get sample customers
function getSampleCustomers() {
    return [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            phone: '(555) 123-4567',
            address: {
                street: '123 Main St',
                city: 'New York',
                state: 'NY',
                zip: '10001',
                country: 'USA'
            },
            dateAdded: '2023-01-15T10:30:00Z'
        },
        {
            id: 2,
            firstName: 'Emily',
            lastName: 'Johnson',
            email: 'emily.johnson@example.com',
            phone: '(555) 987-6543',
            address: {
                street: '456 Park Ave',
                city: 'Los Angeles',
                state: 'CA',
                zip: '90001',
                country: 'USA'
            },
            dateAdded: '2023-02-20T15:45:00Z'
        },
        {
            id: 3,
            firstName: 'Michael',
            lastName: 'Brown',
            email: 'michael.brown@example.com',
            phone: '(555) 456-7890',
            address: {
                street: '789 Oak St',
                city: 'Chicago',
                state: 'IL',
                zip: '60007',
                country: 'USA'
            },
            dateAdded: '2023-03-10T11:20:00Z'
        },
        {
            id: 4,
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah.wilson@example.com',
            phone: '(555) 789-0123',
            address: {
                street: '321 Pine St',
                city: 'Miami',
                state: 'FL',
                zip: '33101',
                country: 'USA'
            },
            dateAdded: '2023-04-05T09:15:00Z'
        },
        {
            id: 5,
            firstName: 'David',
            lastName: 'Lee',
            email: 'david.lee@example.com',
            phone: '(555) 234-5678',
            address: {
                street: '654 Maple Ave',
                city: 'Seattle',
                state: 'WA',
                zip: '98101',
                country: 'USA'
            },
            dateAdded: '2023-05-18T16:40:00Z'
        }
    ];
}