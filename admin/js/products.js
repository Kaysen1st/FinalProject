// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin || !admin.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize products page
    initProductsPage();
});

// Initialize products page
function initProductsPage() {
    // Load products
    loadProducts();
    
    // Initialize product form
    initProductForm();
    
    // Initialize product filters
    initProductFilters();
    
    // Initialize bulk actions
    initBulkActions();
}

// Load products
function loadProducts() {
    const productsTable = document.getElementById('productsTable');
    const productCount = document.getElementById('productCount');
    
    if (!productsTable) return;
    
    // Get products from localStorage or use sample data if none exists
    let products = JSON.parse(localStorage.getItem('products')) || getSampleProducts();
    
    // Save sample products to localStorage if none exist
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Update product count
    if (productCount) productCount.textContent = products.length;
    
    // Generate HTML for products
    let productsHTML = '';
    
    if (products.length === 0) {
        productsHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">No products found</td>
            </tr>
        `;
    } else {
        products.forEach(product => {
            // Determine stock status
            let stockStatus = '';
            let stockBadgeClass = '';
            
            if (product.stock <= 0) {
                stockStatus = 'Out of Stock';
                stockBadgeClass = 'bg-danger';
            } else if (product.stock < 10) {
                stockStatus = 'Low Stock';
                stockBadgeClass = 'bg-warning';
            } else {
                stockStatus = 'In Stock';
                stockBadgeClass = 'bg-success';
            }
            
            productsHTML += `
                <tr>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input product-checkbox" type="checkbox" value="${product.id}">
                        </div>
                    </td>
                    <td>
                        <img src="${product.image}" alt="${product.name}" width="50" height="50" style="object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${product.category}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <span class="badge ${stockBadgeClass}">${stockStatus}</span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary view-product" data-id="${product.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary edit-product" data-id="${product.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    productsTable.innerHTML = productsHTML;
    
    // Add event listeners to product actions
    addProductActionListeners();
}

// Initialize product form
function initProductForm() {
    const productForm = document.getElementById('productForm');
    const saveProductBtn = document.getElementById('saveProduct');
    const productImage = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (!productForm || !saveProductBtn) return;
    
    // Handle image preview
    if (productImage && imagePreview) {
        productImage.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Image">`;
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.innerHTML = `
                    <i class="bi bi-image"></i>
                    <span>No image selected</span>
                `;
            }
        });
    }
    
    // Handle save product
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', function() {
            // Validate form
            if (!productForm.checkValidity()) {
                productForm.reportValidity();
                return;
            }
            
            // Get form values
            const productId = document.getElementById('productId').value;
            const name = document.getElementById('productName').value;
            const brand = document.getElementById('productBrand').value;
            const category = document.getElementById('productCategory').value;
            const price = parseFloat(document.getElementById('productPrice').value);
            const stock = parseInt(document.getElementById('productStock').value);
            const description = document.getElementById('productDescription').value;
            const styleCode = document.getElementById('productStyleCode').value;
            const colorway = document.getElementById('productColorway').value;
            const isActive = document.getElementById('productActive').checked;
            
            // Get selected sizes
            const sizeCheckboxes = document.querySelectorAll('.size-checkbox:checked');
            const sizes = Array.from(sizeCheckboxes).map(checkbox => parseFloat(checkbox.value));
            
            // Get image
            let image = '';
            if (imagePreview.querySelector('img')) {
                image = imagePreview.querySelector('img').src;
            } else {
                // Use placeholder image if none selected
                image = 'https://via.placeholder.com/300';
            }
            
            // Get products from localStorage
            let products = JSON.parse(localStorage.getItem('products')) || [];
            
            if (productId) {
                // Update existing product
                const index = products.findIndex(p => p.id === parseInt(productId));
                if (index !== -1) {
                    products[index] = {
                        ...products[index],
                        name,
                        brand,
                        category,
                        price,
                        stock,
                        description,
                        styleCode,
                        colorway,
                        sizes,
                        isActive,
                        image
                    };
                    
                    showNotification('Product updated successfully', 'success');
                }
            } else {
                // Create new product
                const newProduct = {
                    id: Date.now(),
                    name,
                    brand,
                    category,
                    price,
                    stock,
                    description,
                    styleCode,
                    colorway,
                    sizes,
                    isActive,
                    image,
                    sales: 0,
                    revenue: 0
                };
                
                products.push(newProduct);
                showNotification('Product added successfully', 'success');
            }
            
            // Save products to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
            modal.hide();
            
            // Reload products
            loadProducts();
            
            // Reset form
            resetProductForm();
        });
    }
}

// Reset product form
function resetProductForm() {
    const productForm = document.getElementById('productForm');
    const imagePreview = document.getElementById('imagePreview');
    const productId = document.getElementById('productId');
    
    if (productForm) {
        productForm.reset();
    }
    
    if (imagePreview) {
        imagePreview.innerHTML = `
            <i class="bi bi-image"></i>
            <span>No image selected</span>
        `;
    }
    
    if (productId) {
        productId.value = '';
    }
    
    // Update modal title
    const modalTitle = document.getElementById('addProductModalLabel');
    if (modalTitle) {
        modalTitle.textContent = 'Add New Product';
    }
}

// Initialize product filters
function initProductFilters() {
    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const stockFilter = document.getElementById('stockFilter');
    const resetFilters = document.getElementById('resetFilters');
    
    // Search filter
    if (productSearch) {
        productSearch.addEventListener('input', applyFilters);
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    // Brand filter
    if (brandFilter) {
        brandFilter.addEventListener('change', applyFilters);
    }
    
    // Stock filter
    if (stockFilter) {
        stockFilter.addEventListener('change', applyFilters);
    }
    
    // Reset filters
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            if (productSearch) productSearch.value = '';
            if (categoryFilter) categoryFilter.value = '';
            if (brandFilter) brandFilter.value = '';
            if (stockFilter) stockFilter.value = '';
            
            applyFilters();
        });
    }
}

// Apply filters to products
function applyFilters() {
    const productsTable = document.getElementById('productsTable');
    const productCount = document.getElementById('productCount');
    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const brandFilter = document.getElementById('brandFilter');
    const stockFilter = document.getElementById('stockFilter');
    
    if (!productsTable) return;
    
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Apply search filter
    if (productSearch && productSearch.value) {
        const searchTerm = productSearch.value.toLowerCase();
        products = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter.value) {
        products = products.filter(product => product.category === categoryFilter.value);
    }
    
    // Apply brand filter
    if (brandFilter && brandFilter.value) {
        products = products.filter(product => product.brand === brandFilter.value);
    }
    
    // Apply stock filter
    if (stockFilter && stockFilter.value) {
        switch (stockFilter.value) {
            case 'in-stock':
                products = products.filter(product => product.stock > 10);
                break;
            case 'low-stock':
                products = products.filter(product => product.stock > 0 && product.stock <= 10);
                break;
            case 'out-of-stock':
                products = products.filter(product => product.stock <= 0);
                break;
        }
    }
    
    // Update product count
    if (productCount) productCount.textContent = products.length;
    
    // Generate HTML for filtered products
    let productsHTML = '';
    
    if (products.length === 0) {
        productsHTML = `
            <tr>
                <td colspan="9" class="text-center py-4">No products found</td>
            </tr>
        `;
    } else {
        products.forEach(product => {
            // Determine stock status
            let stockStatus = '';
            let stockBadgeClass = '';
            
            if (product.stock <= 0) {
                stockStatus = 'Out of Stock';
                stockBadgeClass = 'bg-danger';
            } else if (product.stock < 10) {
                stockStatus = 'Low Stock';
                stockBadgeClass = 'bg-warning';
            } else {
                stockStatus = 'In Stock';
                stockBadgeClass = 'bg-success';
            }
            
            productsHTML += `
                <tr>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input product-checkbox" type="checkbox" value="${product.id}">
                        </div>
                    </td>
                    <td>
                        <img src="${product.image}" alt="${product.name}" width="50" height="50" style="object-fit: cover; border-radius: 4px;">
                    </td>
                    <td>${product.name}</td>
                    <td>${product.brand}</td>
                    <td>${product.category}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <span class="badge ${stockBadgeClass}">${stockStatus}</span>
                    </td>
                    <td>
                        <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-primary view-product" data-id="${product.id}">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary edit-product" data-id="${product.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }
    
    productsTable.innerHTML = productsHTML;
    
    // Add event listeners to product actions
    addProductActionListeners();
}

// Initialize bulk actions
function initBulkActions() {
    const selectAllProducts = document.getElementById('selectAllProducts');
    const bulkDeleteProducts = document.getElementById('bulkDeleteProducts');
    const confirmDelete = document.getElementById('confirmDelete');
    
    // Select all products
    if (selectAllProducts) {
        selectAllProducts.addEventListener('change', function() {
            const productCheckboxes = document.querySelectorAll('.product-checkbox');
            productCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
            
            // Enable/disable bulk delete button
            if (bulkDeleteProducts) {
                bulkDeleteProducts.disabled = !this.checked;
            }
        });
    }
    
    // Enable/disable bulk delete button based on selections
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('product-checkbox')) {
            const checkedProducts = document.querySelectorAll('.product-checkbox:checked');
            if (bulkDeleteProducts) {
                bulkDeleteProducts.disabled = checkedProducts.length === 0;
            }
            
            // Update select all checkbox
            if (selectAllProducts) {
                const allProductCheckboxes = document.querySelectorAll('.product-checkbox');
                selectAllProducts.checked = checkedProducts.length === allProductCheckboxes.length && allProductCheckboxes.length > 0;
                selectAllProducts.indeterminate = checkedProducts.length > 0 && checkedProducts.length < allProductCheckboxes.length;
            }
        }
    });
    
    // Bulk delete products
    if (bulkDeleteProducts) {
        bulkDeleteProducts.addEventListener('click', function() {
            const checkedProducts = document.querySelectorAll('.product-checkbox:checked');
            if (checkedProducts.length === 0) return;
            
            // Show confirmation modal
            const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
            deleteConfirmModal.show();
        });
    }
    
    // Confirm delete
    if (confirmDelete) {
        confirmDelete.addEventListener('click', function() {
            const checkedProducts = document.querySelectorAll('.product-checkbox:checked');
            const selectedIds = Array.from(checkedProducts).map(checkbox => parseInt(checkbox.value));
            
            // Get products from localStorage
            let products = JSON.parse(localStorage.getItem('products')) || [];
            
            // Filter out selected products
            products = products.filter(product => !selectedIds.includes(product.id));
            
            // Save updated products to localStorage
            localStorage.setItem('products', JSON.stringify(products));
            
            // Close modal
            const deleteConfirmModal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
            deleteConfirmModal.hide();
            
            // Show success message
            showNotification(`${selectedIds.length} product(s) deleted successfully`, 'success');
            
            // Reload products
            loadProducts();
        });
    }
}

// Add event listeners to product actions
function addProductActionListeners() {
    // View product
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            viewProduct(productId);
        });
    });
    
    // Edit product
    document.querySelectorAll('.edit-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            editProduct(productId);
        });
    });
    
    // Delete product
    document.querySelectorAll('.delete-product').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            
            // Show confirmation modal
            const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
            deleteConfirmModal.show();
            
            // Set up confirm delete button
            const confirmDelete = document.getElementById('confirmDelete');
            if (confirmDelete) {
                confirmDelete.onclick = function() {
                    deleteProduct(productId);
                    deleteConfirmModal.hide();
                };
            }
        });
    });
    
    // Edit product from details modal
    document.querySelectorAll('.edit-product-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productDetailsModal = bootstrap.Modal.getInstance(document.getElementById('productDetailsModal'));
            productDetailsModal.hide();
            
            const productId = this.getAttribute('data-product-id');
            editProduct(parseInt(productId));
        });
    });
}

// View product details
function viewProduct(productId) {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Find product by ID
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill product details modal
    document.getElementById('detailsProductName').textContent = product.name;
    document.getElementById('detailsProductBrand').textContent = product.brand;
    document.getElementById('detailsProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('detailsProductCategory').textContent = product.category;
    
    // Set stock status
    let stockStatus = '';
    if (product.stock <= 0) {
        stockStatus = 'Out of Stock';
        document.getElementById('detailsProductStock').className = 'badge bg-danger';
    } else if (product.stock < 10) {
        stockStatus = `Low Stock (${product.stock})`;
        document.getElementById('detailsProductStock').className = 'badge bg-warning';
    } else {
        stockStatus = `In Stock (${product.stock})`;
        document.getElementById('detailsProductStock').className = 'badge bg-success';
    }
    document.getElementById('detailsProductStock').textContent = stockStatus;
    
    document.getElementById('detailsProductDescription').textContent = product.description;
    document.getElementById('detailsProductStyleCode').textContent = product.styleCode || 'N/A';
    document.getElementById('detailsProductColorway').textContent = product.colorway || 'N/A';
    document.getElementById('detailsProductImage').src = product.image;
    
    // Set available sizes
    const sizesContainer = document.getElementById('detailsProductSizes');
    if (product.sizes && product.sizes.length > 0) {
        let sizesHTML = '';
        product.sizes.forEach(size => {
            sizesHTML += `<span class="badge bg-secondary me-1 mb-1">${size}</span>`;
        });
        sizesContainer.innerHTML = sizesHTML;
    } else {
        sizesContainer.innerHTML = '<span class="text-muted">No sizes available</span>';
    }
    
    // Set performance data
    document.getElementById('detailsProductTotalSales').textContent = product.sales || 0;
    document.getElementById('detailsProductRevenue').textContent = `$${(product.revenue || 0).toFixed(2)}`;
    
    // Set product ID on edit button
    document.querySelector('.edit-product-btn').setAttribute('data-product-id', product.id);
    
    // Show modal
    const productDetailsModal = new bootstrap.Modal(document.getElementById('productDetailsModal'));
    productDetailsModal.show();
}

// Edit product
function editProduct(productId) {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Find product by ID
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Update modal title
    const modalTitle = document.getElementById('addProductModalLabel');
    if (modalTitle) {
        modalTitle.textContent = 'Edit Product';
    }
    
    // Fill form with product data
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productBrand').value = product.brand;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productStyleCode').value = product.styleCode || '';
    document.getElementById('productColorway').value = product.colorway || '';
    document.getElementById('productActive').checked = product.isActive !== false;
    
    // Set image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    }
    
    // Check size checkboxes
    document.querySelectorAll('.size-checkbox').forEach(checkbox => {
        checkbox.checked = product.sizes && product.sizes.includes(parseFloat(checkbox.value));
    });
    
    // Show modal
    const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'));
    addProductModal.show();
}

// Delete product
function deleteProduct(productId) {
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filter out the product to delete
    products = products.filter(product => product.id !== productId);
    
    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Show success message
    showNotification('Product deleted successfully', 'success');
    
    // Reload products
    loadProducts();
}

// Get sample products
function getSampleProducts() {
    return [
        {
            id: 1,
            name: 'Air Jordan 1 Retro High OG',
            brand: 'Jordan',
            price: 179.99,
            stock: 25,
            image: '../assets/product-1.jpg',
            category: 'Basketball',
            description: 'The Air Jordan 1 Retro High OG features a genuine leather upper, Nike Air cushioning and an encapsulated Air-Sole unit for lightweight cushioning.',
            styleCode: '555088-123',
            colorway: 'White/Black-Red',
            sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
            isActive: true,
            sales: 28,
            revenue: 5039.72
        },
        {
            id: 2,
            name: 'Yeezy Boost 350 V2',
            brand: 'Adidas',
            price: 249.99,
            stock: 12,
            image: '../assets/product-2.jpg',
            category: 'Lifestyle',
            description: 'The Yeezy Boost 350 V2 features an upper composed of re-engineered Primeknit. The post-dyed monofilament side stripe is woven into the upper. Reflective threads are woven into the laces. The midsole utilizes adidas innovative BOOST™ technology.',
            styleCode: 'FZ5000',
            colorway: 'Grey/Core Black/Red',
            sizes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
            isActive: true,
            sales: 24,
            revenue: 5999.76
        },
        {
            id: 3,
            name: 'Nike Dunk Low',
            brand: 'Nike',
            price: 129.99,
            stock: 8,
            image: '../assets/product-3.jpg',
            category: 'Lifestyle',
            description: 'The Nike Dunk Low features a low-cut silhouette that combines comfort and style. The padded, low-cut collar allows a full range of motion, while the rubber outsole provides excellent traction.',
            styleCode: 'DD1391-100',
            colorway: 'White/Black',
            sizes: [6, 7, 8, 9, 10, 11, 12],
            isActive: true,
            sales: 22,
            revenue: 2859.78
        },
        {
            id: 4,
            name: 'New Balance 550',
            brand: 'New Balance',
            price: 119.99,
            stock: 15,
            image: '../assets/product-4.jpg',
            category: 'Lifestyle',
            description: 'The New Balance 550 is a retro basketball silhouette brought back from the archives. Features a leather upper with perforated details and a cupsole for comfort and durability.',
            styleCode: 'BB550WT1',
            colorway: 'White/Green',
            sizes: [7, 8, 9, 10, 11, 12],
            isActive: true,
            sales: 16,
            revenue: 1919.84
        },
        {
            id: 5,
            name: 'Air Jordan 4 Retro',
            brand: 'Jordan',
            price: 209.99,
            stock: 5,
            image: '../assets/product-5.jpg',
            category: 'Basketball',
            description: 'The Air Jordan 4 Retro features a premium leather upper with the iconic visible Air cushioning in the heel for responsive comfort.',
            styleCode: 'CT8527-100',
            colorway: 'White/Fire Red-Black-Tech Grey',
            sizes: [7, 8, 9, 9.5, 10, 10.5, 11, 12],
            isActive: true,
            sales: 14,
            revenue: 2939.86
        },
        {
            id: 6,
            name: 'Adidas Forum Low',
            brand: 'Adidas',
            price: 99.99,
            stock: 20,
            image: '../assets/product-6.jpg',
            category: 'Lifestyle',
            description: 'The adidas Forum Low is a basketball-inspired shoe made with a leather upper and signature ankle strap for a secure fit.',
            styleCode: 'FY7755',
            colorway: 'Cloud White/Blue',
            sizes: [7, 8, 9, 10, 11, 12, 13],
            isActive: true,
            sales: 12,
            revenue: 1199.88
        },
        {
            id: 7,
            name: 'Nike Air Force 1 Low',
            brand: 'Nike',
            price: 109.99,
            stock: 30,
            image: '../assets/product-7.jpg',
            category: 'Lifestyle',
            description: 'The Nike Air Force 1 Low is a modern take on the iconic basketball shoe that combines court style with off-court attitude.',
            styleCode: '315122-111',
            colorway: 'White/White',
            sizes: [6, 7, 8, 9, 10, 11, 12, 13],
            isActive: true,
            sales: 18,
            revenue: 1979.82
        },
        {
            id: 8,
            name: 'Puma Suede Classic',
            brand: 'Puma',
            price: 79.99,
            stock: 0,
            image: '../assets/product-8.jpg',
            category: 'Lifestyle',
            description: 'The Puma Suede Classic features a soft suede upper with the iconic Puma Formstrip and a rubber outsole for excellent traction.',
            styleCode: '352634-03',
            colorway: 'Black/White',
            sizes: [7, 8, 9, 10, 11, 12],
            isActive: true,
            sales: 10,
            revenue: 799.90
        }
    ];
}// Add these functions to the existing products.js file

// Function to trigger product created/updated event
function triggerProductEvent(product, isNew = false) {
    // Dispatch event for integration
    document.dispatchEvent(new CustomEvent(isNew ? 'product:created' : 'product:updated', {
        detail: { product }
    }));
}

// Function to trigger product deleted event
function triggerProductDeletedEvent(productId) {
    // Dispatch event for integration
    document.dispatchEvent(new CustomEvent('product:deleted', {
        detail: { productId }
    }));
}

// Update the saveProduct click handler to include integration
if (saveProductBtn) {
    saveProductBtn.addEventListener('click', function() {
        // Validate form
        if (!productForm.checkValidity()) {
            productForm.reportValidity();
            return;
        }
        
        // Get form values
        const productId = document.getElementById('productId').value;
        const name = document.getElementById('productName').value;
        const brand = document.getElementById('productBrand').value;
        const category = document.getElementById('productCategory').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const stock = parseInt(document.getElementById('productStock').value);
        const description = document.getElementById('productDescription').value;
        const styleCode = document.getElementById('productStyleCode').value;
        const colorway = document.getElementById('productColorway').value;
        const isActive = document.getElementById('productActive').checked;
        
        // Get selected sizes
        const sizeCheckboxes = document.querySelectorAll('.size-checkbox:checked');
        const sizes = Array.from(sizeCheckboxes).map(checkbox => parseFloat(checkbox.value));
        
        // Get image
        let image = '';
        if (imagePreview.querySelector('img')) {
            image = imagePreview.querySelector('img').src;
        } else {
            // Use placeholder image if none selected
            image = 'https://via.placeholder.com/300';
        }
        
        // Get products from localStorage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        let updatedProduct;
        let isNewProduct = !productId;
        
        if (productId) {
            // Update existing product
            const index = products.findIndex(p => p.id === parseInt(productId));
            if (index !== -1) {
                updatedProduct = {
                    ...products[index],
                    name,
                    brand,
                    category,
                    price,
                    stock,
                    description,
                    styleCode,
                    colorway,
                    sizes,
                    isActive,
                    image,
                    lastUpdated: new Date().toISOString()
                };
                
                products[index] = updatedProduct;
                showNotification('Product updated successfully', 'success');
            }
        } else {
            // Create new product
            updatedProduct = {
                id: Date.now(),
                name,
                brand,
                category,
                price,
                stock,
                description,
                styleCode,
                colorway,
                sizes,
                isActive,
                image,
                sales: 0,
                revenue: 0,
                dateAdded: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            products.push(updatedProduct);
            showNotification('Product added successfully', 'success');
        }
        
        // Save products to localStorage
        localStorage.setItem('products', JSON.stringify(products));
        
        // Trigger integration event
        triggerProductEvent(updatedProduct, isNewProduct);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal.hide();
        
        // Reload products
        loadProducts();
        
        // Reset form
        resetProductForm();
    });
}

// Update the deleteProduct function to include integration
function deleteProduct(productId) {
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Filter out the product to delete
    products = products.filter(product => product.id !== productId);
    
    // Save updated products to localStorage
    localStorage.setItem('products', JSON.stringify(products));
    
    // Trigger integration event
    triggerProductDeletedEvent(productId);
    
    // Show success message
    showNotification('Product deleted successfully', 'success');
    
    // Reload products
    loadProducts();
}

// Update bulkDeleteProducts function to include integration
function bulkDeleteCustomers(customerIds) {
    // Get customers from localStorage
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    
    // Filter out the customers to delete
    customers = customers.filter(customer => !customerIds.includes(customer.id));
    
    // Save updated customers to localStorage
    localStorage.setItem('customers', JSON.stringify(customers));
    
    // Trigger integration events for each deleted customer
    customerIds.forEach(id => {
        triggerCustomerDeletedEvent(id);
    });
    
    // Show success message
    showNotification(`${customerIds.length} customer(s) deleted successfully`, 'success');
    
    // Reload customers
    loadCustomers();
}

// Function to trigger customer deleted event
function triggerCustomerDeletedEvent(customerId) {
    // Dispatch event for integration
    document.dispatchEvent(new CustomEvent('customer:deleted', {
        detail: { customerId }
    }));
}