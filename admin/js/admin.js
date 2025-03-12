// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAdminAuth();
    
    // Initialize login form
    initLoginForm();
    
    // Initialize sidebar toggle
    initSidebarToggle();
    
    // Initialize logout functionality
    initLogout();
    
    // Initialize dashboard if on dashboard page
    if (document.getElementById('salesChart')) {
        initDashboard();
    }
});

// Check if admin is authenticated
function checkAdminAuth() {
    const adminContainer = document.getElementById('admin-container');
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    // Check if admin is logged in
    const admin = JSON.parse(localStorage.getItem('admin'));
    
    if (admin && admin.isLoggedIn) {
        // Show dashboard
        if (loginContainer) loginContainer.classList.add('d-none');
        if (dashboardContainer) dashboardContainer.classList.remove('d-none');
        
        // Update admin name
        const adminNameElements = document.querySelectorAll('.admin-name');
        adminNameElements.forEach(element => {
            element.textContent = admin.name || 'Admin User';
        });
    } else {
        // Show login form if it exists
        if (loginContainer && dashboardContainer) {
            loginContainer.classList.remove('d-none');
            dashboardContainer.classList.add('d-none');
        }
    }
}

// Initialize login form
function initLoginForm() {
    const loginForm = document.getElementById('admin-login-form');
    if (!loginForm) return;
    
    // Password toggle
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('adminPassword');
            const icon = this.querySelector('i');
            
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
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        const rememberMe = document.getElementById('rememberAdmin').checked;
        
        // Simple validation
        if (!email || !password) {
            showNotification('Please enter both email and password', 'error');
            return;
        }
        
        // For demo purposes, accept any email with admin and password "admin123"
        if (email.includes('admin') && password === 'admin123') {
            // Store admin info
            const admin = {
                email: email,
                name: 'Admin User',
                isLoggedIn: true
            };
            
            localStorage.setItem('admin', JSON.stringify(admin));
            
            // Show success message
            showNotification('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                checkAdminAuth();
            }, 1000);
        } else {
            showNotification('Invalid credentials. Try admin@urbantreads.com / admin123', 'error');
        }
    });
}

// Initialize sidebar toggle for mobile
function initSidebarToggle() {
    const sidebarToggler = document.querySelector('.sidebar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggler && sidebar) {
        sidebarToggler.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 992 && 
                !sidebar.contains(e.target) && 
                !sidebarToggler.contains(e.target) && 
                sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            }
        });
    }
}

// Initialize logout functionality
function initLogout() {
    const logoutBtns = document.querySelectorAll('.logout-btn');
    
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear admin data
            localStorage.removeItem('admin');
            
            // Show success message
            showNotification('Logged out successfully', 'success');
            
            // Redirect to login page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    });
}

// Initialize dashboard
function initDashboard() {
    // Load dashboard data
    loadDashboardData();
    
    // Initialize charts
    initSalesChart();
    initCategoriesChart();
    
    // Load recent orders
    loadRecentOrders();
    
    // Load top products
    loadTopProducts();
}

// Load dashboard data
function loadDashboardData() {
    // In a real application, this would fetch data from an API
    // For this demo, we'll use mock data
    
    // Sales data
    const totalSales = document.querySelector('.total-sales');
    const salesChange = document.querySelector('.sales-change');
    
    if (totalSales) totalSales.textContent = '$12,846.55';
    if (salesChange) {
        salesChange.textContent = '+12.5%';
        salesChange.classList.add('text-success');
    }
    
    // Orders data
    const totalOrders = document.querySelector('.total-orders');
    const ordersChange = document.querySelector('.orders-change');
    
    if (totalOrders) totalOrders.textContent = '156';
    if (ordersChange) {
        ordersChange.textContent = '+8.2%';
        ordersChange.classList.add('text-success');
    }
    
    // Customers data
    const totalCustomers = document.querySelector('.total-customers');
    const customersChange = document.querySelector('.customers-change');
    
    if (totalCustomers) totalCustomers.textContent = '1,245';
    if (customersChange) {
        customersChange.textContent = '+15.7%';
        customersChange.classList.add('text-success');
    }
    
    // Products data
    const totalProducts = document.querySelector('.total-products');
    const lowStockCount = document.querySelector('.low-stock-count');
    
    if (totalProducts) totalProducts.textContent = '48';
    if (lowStockCount) lowStockCount.textContent = '5';
}

// Initialize sales chart
function initSalesChart() {
    const salesChartCanvas = document.getElementById('salesChart');
    if (!salesChartCanvas) return;
    
    // Sample data for the last 7 days
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesData = [1250, 1850, 1350, 2100, 1800, 2500, 2000];
    const ordersData = [15, 20, 18, 25, 22, 30, 26];
    
    const salesChart = new Chart(salesChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Sales ($)',
                    data: salesData,
                    borderColor: '#3a5dff',
                    backgroundColor: 'rgba(58, 93, 255, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Orders',
                    data: ordersData,
                    borderColor: '#ff3366',
                    backgroundColor: 'rgba(255, 51, 102, 0.1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Sales ($)'
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    title: {
                        display: true,
                        text: 'Orders'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Initialize categories chart
function initCategoriesChart() {
    const categoriesChartCanvas = document.getElementById('categoriesChart');
    if (!categoriesChartCanvas) return;
    
    // Sample data
    const data = {
        labels: ['Basketball', 'Lifestyle', 'Running', 'Limited Edition'],
        datasets: [{
            label: 'Sales by Category',
            data: [35, 45, 15, 5],
            backgroundColor: [
                '#3a5dff',
                '#ff3366',
                '#00d3a9',
                '#ffc107'
            ],
            hoverOffset: 4
        }]
    };
    
    const categoriesChart = new Chart(categoriesChartCanvas, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Load recent orders
function loadRecentOrders() {
    const recentOrdersTable = document.getElementById('recentOrdersTable');
    if (!recentOrdersTable) return;
    
    // Sample recent orders
    const recentOrders = [
        {
            id: 'UT12345678',
            customer: 'John Smith',
            date: '2023-06-15',
            amount: 289.98,
            status: 'delivered'
        },
        {
            id: 'UT87654321',
            customer: 'Emily Johnson',
            date: '2023-06-14',
            amount: 249.99,
            status: 'shipped'
        },
        {
            id: 'UT23456789',
            customer: 'Michael Brown',
            date: '2023-06-14',
            amount: 179.99,
            status: 'processing'
        },
        {
            id: 'UT34567890',
            customer: 'Sarah Wilson',
            date: '2023-06-13',
            amount: 129.99,
            status: 'new'
        },
        {
            id: 'UT45678901',
            customer: 'David Lee',
            date: '2023-06-12',
            amount: 359.97,
            status: 'delivered'
        }
    ];
    
    // Generate HTML for recent orders
    let ordersHTML = '';
    
    recentOrders.forEach(order => {
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
        
        ordersHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${formattedDate}</td>
                <td>$${order.amount.toFixed(2)}</td>
                <td><span class="badge ${statusBadgeClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>
                    <a href="orders.html" class="btn btn-sm btn-outline-primary">View</a>
                </td>
            </tr>
        `;
    });
    
    recentOrdersTable.innerHTML = ordersHTML;
}

// Load top products
function loadTopProducts() {
    const topProductsList = document.getElementById('topProductsList');
    if (!topProductsList) return;
    
    // Sample top products
    const topProducts = [
        {
            id: 1,
            name: 'Air Jordan 1 Retro High OG',
            image: '../assets/product-1.jpg',
            sales: 28,
            revenue: 5039.72
        },
        {
            id: 2,
            name: 'Yeezy Boost 350 V2',
            image: '../assets/product-2.jpg',
            sales: 24,
            revenue: 5999.76
        },
        {
            id: 3,
            name: 'Nike Dunk Low',
            image: '../assets/product-3.jpg',
            sales: 22,
            revenue: 2859.78
        },
        {
            id: 7,
            name: 'Nike Air Force 1 Low',
            image: '../assets/product-7.jpg',
            sales: 18,
            revenue: 1979.82
        }
    ];
    
    // Generate HTML for top products
    let productsHTML = '';
    
    topProducts.forEach(product => {
        productsHTML += `
            <li class="list-group-item">
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" class="me-3" width="50" height="50" style="object-fit: cover; border-radius: 4px;">
                    <div class="flex-grow-1">
                        <h6 class="mb-0">${product.name}</h6>
                        <small class="text-muted">${product.sales} sold</small>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold">$${product.revenue.toFixed(2)}</div>
                    </div>
                </div>
            </li>
        `;
    });
    
    topProductsList.innerHTML = productsHTML;
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
            <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-exclamation-circle' : type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'}"></i>
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