// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin || !admin.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize analytics page
    initAnalyticsPage();
});

// Initialize analytics page
function initAnalyticsPage() {
    // Initialize date range picker
    initDateRangePicker();
    
    // Load analytics data
    loadAnalyticsData();
    
    // Initialize charts
    initRevenueChart();
    initOrdersChart();
    initProductsChart();
    initCustomersChart();
}

// Initialize date range picker
function initDateRangePicker() {
    const dateRange = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const applyDateRange = document.getElementById('applyDateRange');
    
    if (!dateRange) return;
    
    // Show/hide custom date inputs
    dateRange.addEventListener('change', function() {
        if (this.value === 'custom' && customDateRange) {
            customDateRange.classList.remove('d-none');
        } else {
            if (customDateRange) customDateRange.classList.add('d-none');
            loadAnalyticsData();
            updateCharts();
        }
    });
    
    // Apply custom date range
    if (applyDateRange) {
        applyDateRange.addEventListener('click', function() {
            if (startDate && endDate && startDate.value && endDate.value) {
                loadAnalyticsData(new Date(startDate.value), new Date(endDate.value));
                updateCharts(new Date(startDate.value), new Date(endDate.value));
            } else {
                showNotification('Please select both start and end dates', 'error');
            }
        });
    }
}

// Load analytics data
function loadAnalyticsData(startDate, endDate) {
    // Get DOM elements
    const totalRevenue = document.getElementById('totalRevenue');
    const totalOrders = document.getElementById('totalOrders');
    const totalCustomers = document.getElementById('totalCustomers');
    const averageOrderValue = document.getElementById('averageOrderValue');
    const conversionRate = document.getElementById('conversionRate');
    
    if (!totalRevenue || !totalOrders || !totalCustomers || !averageOrderValue || !conversionRate) return;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get date range
    const dateRangeValue = document.getElementById('dateRange')?.value || 'last30days';
    
    let filteredOrders = [...orders];
    
    // Filter orders by date range
    if (startDate && endDate) {
        // Custom date range
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
    } else {
        // Predefined date range
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        let rangeStart;
        
        switch (dateRangeValue) {
            case 'today':
                rangeStart = new Date(today);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'yesterday':
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 1);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'last7days':
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 6);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'last30days':
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 29);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'thismonth':
                rangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastmonth':
                rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
                today.setDate(lastDay.getDate());
                break;
            default:
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 29);
                rangeStart.setHours(0, 0, 0, 0);
        }
        
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= rangeStart && orderDate <= today;
        });
    }
    
    // Calculate analytics metrics
    const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = filteredOrders.length;
    
    // Count unique customers
    const customerEmails = new Set();
    filteredOrders.forEach(order => {
        if (order.customer && order.customer.email) {
            customerEmails.add(order.customer.email);
        }
    });
    const customerCount = customerEmails.size;
    
    // Calculate average order value
    const aov = orderCount > 0 ? revenue / orderCount : 0;
    
    // Calculate conversion rate (for demo purposes, assume 100 visits per order)
    const visits = orderCount * 100;
    const cr = visits > 0 ? (orderCount / visits) * 100 : 0;
    
    // Update UI
    totalRevenue.textContent = `$${revenue.toFixed(2)}`;
    totalOrders.textContent = orderCount;
    totalCustomers.textContent = customerCount;
    averageOrderValue.textContent = `$${aov.toFixed(2)}`;
    conversionRate.textContent = `${cr.toFixed(2)}%`;
    
    // Update top products table
    updateTopProducts(filteredOrders);
    
    // Update top customers table
    updateTopCustomers(filteredOrders);
}

// Update top products table
function updateTopProducts(orders) {
    const topProductsTable = document.getElementById('topProductsTable');
    if (!topProductsTable) return;
    
    // Extract all order items
    const allItems = [];
    orders.forEach(order => {
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                allItems.push(item);
            });
        }
    });
    
    // Group items by product ID and calculate total quantity and revenue
    const productMap = {};
    
    allItems.forEach(item => {
        const productId = item.productId;
        if (!productMap[productId]) {
            productMap[productId] = {
                id: productId,
                name: item.name,
                brand: item.brand,
                image: item.image,
                quantity: 0,
                revenue: 0
            };
        }
        
        productMap[productId].quantity += item.quantity;
        productMap[productId].revenue += item.price * item.quantity;
    });
    
    // Convert to array and sort by revenue
    const products = Object.values(productMap);
    products.sort((a, b) => b.revenue - a.revenue);
    
    // Take top 5 products
    const topProducts = products.slice(0, 5);
    
    // Generate HTML
    let html = '';
    
    if (topProducts.length === 0) {
        html = `<tr><td colspan="4" class="text-center">No product data available</td></tr>`;
    } else {
        topProducts.forEach((product, index) => {
            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${product.image}" alt="${product.name}" width="40" height="40" class="me-2" style="object-fit: cover; border-radius: 4px;">
                            <div>
                                <div>${product.name}</div>
                                <small class="text-muted">${product.brand}</small>
                            </div>
                        </div>
                    </td>
                    <td>${product.quantity}</td>
                    <td>$${product.revenue.toFixed(2)}</td>
                    <td>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar" role="progressbar" style="width: ${(product.revenue / topProducts[0].revenue) * 100}%"></div>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    topProductsTable.innerHTML = html;
}

// Update top customers table
function updateTopCustomers(orders) {
    const topCustomersTable = document.getElementById('topCustomersTable');
    if (!topCustomersTable) return;
    
    // Group orders by customer email
    const customerMap = {};
    
    orders.forEach(order => {
        if (order.customer && order.customer.email) {
            const email = order.customer.email;
            if (!customerMap[email]) {
                customerMap[email] = {
                    firstName: order.customer.firstName,
                    lastName: order.customer.lastName,
                    email: email,
                    orders: 0,
                    revenue: 0
                };
            }
            
            customerMap[email].orders += 1;
            customerMap[email].revenue += order.total;
        }
    });
    
    // Convert to array and sort by revenue
    const customers = Object.values(customerMap);
    customers.sort((a, b) => b.revenue - a.revenue);
    
    // Take top 5 customers
    const topCustomers = customers.slice(0, 5);
    
    // Generate HTML
    let html = '';
    
    if (topCustomers.length === 0) {
        html = `<tr><td colspan="4" class="text-center">No customer data available</td></tr>`;
    } else {
        topCustomers.forEach((customer, index) => {
            html += `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="customer-avatar me-2">
                                ${customer.firstName.charAt(0)}${customer.lastName.charAt(0)}
                            </div>
                            <div>
                                <div>${customer.firstName} ${customer.lastName}</div>
                                <small class="text-muted">${customer.email}</small>
                            </div>
                        </div>
                    </td>
                    <td>${customer.orders}</td>
                    <td>$${customer.revenue.toFixed(2)}</td>
                    <td>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar" role="progressbar" style="width: ${(customer.revenue / topCustomers[0].revenue) * 100}%"></div>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    topCustomersTable.innerHTML = html;
}

// Initialize revenue chart
function initRevenueChart() {
    const revenueChartCanvas = document.getElementById('revenueChart');
    if (!revenueChartCanvas) return;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Group orders by date
    const revenueByDate = {};
    
    // Get date range
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dateString = date.toISOString().split('T')[0];
        last30Days.push(dateString);
        revenueByDate[dateString] = 0;
    }
    
    // Calculate revenue for each date
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const dateString = orderDate.toISOString().split('T')[0];
        
        if (revenueByDate[dateString] !== undefined) {
            revenueByDate[dateString] += order.total;
        }
    });
    
    // Prepare chart data
    const labels = last30Days;
    const data = last30Days.map(date => revenueByDate[date]);
    
    // Create chart
    const revenueChart = new Chart(revenueChartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: data,
                borderColor: '#3a5dff',
                backgroundColor: 'rgba(58, 93, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 7
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            }
        }
    });
    
    // Save chart instance to window object for later updates
    window.revenueChart = revenueChart;
}

// Initialize orders chart
function initOrdersChart() {
    const ordersChartCanvas = document.getElementById('ordersChart');
    if (!ordersChartCanvas) return;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Group orders by status
    const ordersByStatus = {
        new: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    
    // Count orders by status
    orders.forEach(order => {
        if (ordersByStatus[order.status] !== undefined) {
            ordersByStatus[order.status]++;
        }
    });
    
    // Prepare chart data
    const labels = ['New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const data = [
        ordersByStatus.new,
        ordersByStatus.processing,
        ordersByStatus.shipped,
        ordersByStatus.delivered,
        ordersByStatus.cancelled
    ];
    
    // Create chart
    const ordersChart = new Chart(ordersChartCanvas, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#3a5dff',
                    '#ffc107',
                    '#17a2b8',
                    '#28a745',
                    '#dc3545'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
    
    // Save chart instance to window object for later updates
    window.ordersChart = ordersChart;
}

// Initialize products chart
function initProductsChart() {
    const productsChartCanvas = document.getElementById('productsChart');
    if (!productsChartCanvas) return;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Extract all order items
    const allItems = [];
    orders.forEach(order => {
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                allItems.push(item);
            });
        }
    });
    
    // Group items by brand
    const brandMap = {};
    
    allItems.forEach(item => {
        if (!brandMap[item.brand]) {
            brandMap[item.brand] = 0;
        }
        
        brandMap[item.brand] += item.quantity;
    });
    
    // Prepare chart data
    const labels = Object.keys(brandMap);
    const data = labels.map(brand => brandMap[brand]);
    
    // Random colors for brands
    const colors = [
        '#3a5dff',
        '#ff3366',
        '#00d3a9',
        '#ffc107',
        '#6f42c1',
        '#fd7e14',
        '#20c997',
        '#e83e8c'
    ];
    
    // Create chart
    const productsChart = new Chart(productsChartCanvas, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                borderWidth: 0
            }]
        },
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
    
    // Save chart instance to window object for later updates
    window.productsChart = productsChart;
}

// Initialize customers chart
function initCustomersChart() {
    const customersChartCanvas = document.getElementById('customersChart');
    if (!customersChartCanvas) return;
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Group orders by month
    const last6Months = [];
    const customersByMonth = {};
    
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        last6Months.push(monthYear);
        customersByMonth[monthYear] = new Set();
    }
    
    // Add customers to each month
    orders.forEach(order => {
        if (order.customer && order.customer.email) {
            const orderDate = new Date(order.date);
            const monthYear = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            if (customersByMonth[monthYear]) {
                customersByMonth[monthYear].add(order.customer.email);
            }
        }
    });
    
    // Prepare chart data
    const labels = last6Months;
    const data = labels.map(month => customersByMonth[month].size);
    
    // Create chart
    const customersChart = new Chart(customersChartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unique Customers',
                data: data,
                backgroundColor: '#00d3a9',
                borderColor: '#00d3a9',
                borderWidth: 0,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // Save chart instance to window object for later updates
    window.customersChart = customersChart;
}

// Update charts with new date range
function updateCharts(startDate, endDate) {
    // Get date range
    const dateRangeValue = document.getElementById('dateRange')?.value || 'last30days';
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    let filteredOrders = [...orders];
    
    // Filter orders by date range
    if (startDate && endDate) {
        // Custom date range
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
    } else {
        // Predefined date range
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        let rangeStart;
        
        switch (dateRangeValue) {
            case 'today':
                rangeStart = new Date(today);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'yesterday':
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 1);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'last7days':
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 6);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'last30days':
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 29);
                rangeStart.setHours(0, 0, 0, 0);
                break;
            case 'thismonth':
                rangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'lastmonth':
                rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
                today.setDate(lastDay.getDate());
                break;
            default:
                rangeStart = new Date(today);
                rangeStart.setDate(rangeStart.getDate() - 29);
                rangeStart.setHours(0, 0, 0, 0);
        }
        
        filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.date);
            return orderDate >= rangeStart && orderDate <= today;
        });
    }
    
    // Update revenue chart
    updateRevenueChart(filteredOrders, startDate, endDate);
    
    // Update orders chart
    updateOrdersChart(filteredOrders);
    
    // Update products chart
    updateProductsChart(filteredOrders);
    
    // Update customers chart
    updateCustomersChart(filteredOrders, startDate, endDate);
}

// Update revenue chart with new data
function updateRevenueChart(orders, startDate, endDate) {
    if (!window.revenueChart) return;
    
    let labels = [];
    let revenueByDate = {};
    
    // Determine date range
    if (startDate && endDate) {
        // Custom date range
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        for (let i = 0; i <= diffDays; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);
            
            const dateString = date.toISOString().split('T')[0];
            labels.push(dateString);
            revenueByDate[dateString] = 0;
        }
    } else {
        // Default to last 30 days
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            
            const dateString = date.toISOString().split('T')[0];
            labels.push(dateString);
            revenueByDate[dateString] = 0;
        }
    }
    
    // Calculate revenue for each date
    orders.forEach(order => {
        const orderDate = new Date(order.date);
        const dateString = orderDate.toISOString().split('T')[0];
        
        if (revenueByDate[dateString] !== undefined) {
            revenueByDate[dateString] += order.total;
        }
    });
    
    // Update chart data
    window.revenueChart.data.labels = labels;
    window.revenueChart.data.datasets[0].data = labels.map(date => revenueByDate[date]);
    window.revenueChart.update();
}

// Update orders chart with new data
function updateOrdersChart(orders) {
    if (!window.ordersChart) return;
    
    // Group orders by status
    const ordersByStatus = {
        new: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };
    
    // Count orders by status
    orders.forEach(order => {
        if (ordersByStatus[order.status] !== undefined) {
            ordersByStatus[order.status]++;
        }
    });
    
    // Update chart data
    window.ordersChart.data.datasets[0].data = [
        ordersByStatus.new,
        ordersByStatus.processing,
        ordersByStatus.shipped,
        ordersByStatus.delivered,
        ordersByStatus.cancelled
    ];
    window.ordersChart.update();
}

// Update products chart with new data
function updateProductsChart(orders) {
    if (!window.productsChart) return;
    
    // Extract all order items
    const allItems = [];
    orders.forEach(order => {
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                allItems.push(item);
            });
        }
    });
    
    // Group items by brand
    const brandMap = {};
    
    allItems.forEach(item => {
        if (!brandMap[item.brand]) {
            brandMap[item.brand] = 0;
        }
        
        brandMap[item.brand] += item.quantity;
    });
    
    // Prepare chart data
    const labels = Object.keys(brandMap);
    const data = labels.map(brand => brandMap[brand]);
    
    // Random colors for brands
    const colors = [
        '#3a5dff',
        '#ff3366',
        '#00d3a9',
        '#ffc107',
        '#6f42c1',
        '#fd7e14',
        '#20c997',
        '#e83e8c'
    ];
    
    // Update chart data
    window.productsChart.data.labels = labels;
    window.productsChart.data.datasets[0].data = data;
    window.productsChart.data.datasets[0].backgroundColor = labels.map((_, i) => colors[i % colors.length]);
    window.productsChart.update();
}

// Update customers chart with new data
function updateCustomersChart(orders, startDate, endDate) {
    if (!window.customersChart) return;
    
    let labels = [];
    let customersByPeriod = {};
    
    // Determine date range and grouping
    if (startDate && endDate) {
        // Custom date range
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 30) {
            // Group by day for short ranges
            for (let i = 0; i <= diffDays; i++) {
                const date = new Date(startDate);
                date.setDate(date.getDate() + i);
                
                const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                labels.push(dateString);
                customersByPeriod[dateString] = new Set();
            }
            
            // Add customers to each day
            orders.forEach(order => {
                if (order.customer && order.customer.email) {
                    const orderDate = new Date(order.date);
                    const dateString = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    
                    if (customersByPeriod[dateString]) {
                        customersByPeriod[dateString].add(order.customer.email);
                    }
                }
            });
        } else {
            // Group by month for longer ranges
            const months = {};
            let currentDate = new Date(startDate);
            
            while (currentDate <= endDate) {
                const monthYear = currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                
                if (!months[monthYear]) {
                    months[monthYear] = true;
                    labels.push(monthYear);
                    customersByPeriod[monthYear] = new Set();
                }
                
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            
            // Add customers to each month
            orders.forEach(order => {
                if (order.customer && order.customer.email) {
                    const orderDate = new Date(order.date);
                    const monthYear = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    
                    if (customersByPeriod[monthYear]) {
                        customersByPeriod[monthYear].add(order.customer.email);
                    }
                }
            });
        }
    } else {
        // Default to last 6 months
        const today = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            labels.push(monthYear);            customersByPeriod[monthYear] = new Set();
        }
        
        // Add customers to each month
        orders.forEach(order => {
            if (order.customer && order.customer.email) {
                const orderDate = new Date(order.date);
                const monthYear = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                
                if (customersByPeriod[monthYear]) {
                    customersByPeriod[monthYear].add(order.customer.email);
                }
            }
        });
    }
    
    // Update chart data
    window.customersChart.data.labels = labels;
    window.customersChart.data.datasets[0].data = labels.map(month => customersByPeriod[month].size);
    window.customersChart.update();
}