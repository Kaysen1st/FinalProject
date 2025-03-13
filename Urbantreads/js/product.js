document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart from localStorage
    loadCart();
    
    // Initialize products
    initProducts();
    
    // Initialize navbar scroll effect
    initNavbarScroll();
    
    // Initialize filters
    initFilters();
    
    // Initialize sort options
    initSortOptions();
    
    // Initialize quick view
    initQuickView();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize user menu
    initUserMenu();
});

// Products data
const products = [
    {
        id: 1,
        name: 'Kobe 6 Protro',
        brand: 'Nike',
        price: 165.88,
        image: '/Assests/Nike/Basketball/Mens/KB6/kb6.jpg',
        category: 'Basketball',
        condition: 'New',
        description: 'The Kobe 6 Protro "Sail" honours Kobe"s legacy and the competitive edge he brought to every game. This familiar-yet-unique design replaces the original textured pattern with a raised star pattern. It"s still low, sleek and fast like you remember, but we upgraded the traction. The light Sail base is inspired by a snake shedding its skin to give it a fresh look.',
        styleCode: 'FQ3546-100',
        colorway: 'Sail',
        releaseDate: '2025-02-13',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 2,
        name: 'Sabrina 2 EP',
        brand: 'Nike',
        price: 190.20,
        image: '/Assests/Nike/Basketball/Womens/SB2/sb2.png',
        category: 'Basketball',
        condition: 'New',
        description: 'Sabrina Ionescu’s success is no secret. Her game is based on living in the gym, getting in rep after rep to perfect her craft. The Sabrina 2 sets you up to do more, so you"re ready to go when it"s game-time. Our newest Cushlon foam helps keep you fresh, Air Zoom cushioning adds the pop, and sticky traction helps you create that next-level distance. Sabrina’s handed you the tools. Time to go to work. With its extra-durable rubber outsole, this version gives you traction for outdoor courts.',
        styleCode: 'FZ1517-600',
        colorway: 'Sport Red/College Navy/White',
        releaseDate: '2025-02-15',
        sizes: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 3,
        name: 'Air Superfly',
        brand: 'Nike',
        price: 129.99,
        image: '/Assests/Nike/Running/Womens/ASMR/asm.jpg',
        category: 'Running',
        condition: 'New',
        description: 'The Superfly ushers in a new era of running-inspired design. It emerges from our vault with new Air and a new attitude. The low-profile shape and outsole pattern channel its athletics heritage, while the all-red colourway and textured finishes bring your look up to speed.',
        styleCode: 'HJ8082-601',
        colorway: 'bold Mystic Red',
        releaseDate: '2025-02-08',
        sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
        id: 4,
        name: 'Air Superfly',
        brand: 'Nike',
        price: 129.99,
        image: '/Assests/Nike/Running/Womens/ASL/as.jpg',
        category: 'Running',
        condition: 'New',
        description: 'The Superfly ushers in a new era of running-inspired design. It emerges from our vault with new Air and a new attitude. The low-profile shape and outsole pattern channel its athletics heritage, while the all-red colourway and textured finishes bring your look up to speed.',
        styleCode: ' HJ8082-302',
        colorway: 'Lab Green/Baroque Brown',
        releaseDate: '2025-01-10',
        sizes: [6, 7, 8, 9, 10, 11, 12]
    },
    {
        id: 5,
        name: 'Air Pegasus Wave Premium',
        brand: 'Nike',
        price: 155.40,
        image: '/Assests/Nike/Running/Mens/apgw/apgw.jpg',
        category: 'Running',
        condition: 'New',
        description: 'Meet the Wave—an edgy take on the Air Pegasus. Drawing inspiration from the early 2000s rave scene, it features a mash-up of materials loaded with depth, dimension and heritage running DNA. And a plush midsole houses full-length Nike Air cushioning for supreme comfort underfoot. The glistening colourway mixes Flat Silver with Vast Grey, while Flat Pewter accents and reflective design hits of Metallic Silver create a bold, futuristic finish that"s easy to style..',
        styleCode: 'IB0612-003',
        colorway: 'Flat Silver/Vast Grey',
        releaseDate: '2025-04-01',
        sizes: [7, 8, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 6,
        name: 'Air Zoom Spiridon',
        brand: 'Nike',
        price: 99.99,
        image: '/Assests/Nike/Running/Mens/azs/azs.jpg',
        category: 'Running',
        condition: 'New',
        description: 'The iconic running silhouette is back and ready for the streets. Introduced in 1997, the Air Zoom Spiridon played a pivotal role in the evolution of Nike"s pressure-mapped designs built to improve cushioning for runners. This version taps into the original with its reflective design piping, airy mesh and classic Metallic Silver and Signal Blue colourway. If you"re gonna look back to leap forwards, do it with full-length Air Zoom cushioning beneath your feet. And enjoy the ride.',
        styleCode: 'HF9117-003',
        colorway: 'Metallic Silver/Signal Blue',
        releaseDate: '2021-09-15',
        sizes: [7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 7,
        name: 'Nike Air Force 1 Low',
        brand: 'Nike',
        price: 129.99,
        image: '/Assests/Nike/Lifestyle/Mens/AF1L/af1l.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'Comfortable, durable and timeless—it"s number one for a reason. The classic "80s construction pairs with premium materials for style that tracks whether you"re on court or on the go. This all-white edition of the AF-1 celebrates the spooky season with a perforated design inspired by an iconic slasher film.',
        styleCode: 'IB4025-100',
        colorway: 'White/White',
        releaseDate: '2025-01-27',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 8,
        name: 'Air Jordan 1 Low "Lunar New Year"',
        brand: 'Nike',
        price: 160.90,
        image: '/Assests/Nike/Lifestyle/Mens/AJ1L/aj1l.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'Step into the new year with Jordan"s rendering on the Year of the Snake. Rich textures, intricate patterns and genuine leather give these special kicks a premium look that mimics the shimmer and lustre of reptilian scales. Plus, every pair comes with a commemorative hangtag.',
        styleCode: 'HF3144-100',
        colorway: 'Photon Dust',
        releaseDate: '2025-01-29',
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 9,
        name: 'Nike SB Zoom Blazer Mid x Antihero',
        brand: 'Nike',
        price: 108.23,
        image: '/Assests/Nike/Lifestyle/Mens/SBZB/sbzb.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'Simple, defiant and timeless—the Antihero "eagle" deck has been a perennial board-wall favourite and ATV go-to since the "90s. From the rustic colourway to the detailed and distressed artwork and bold typography, the Antihero Blazer is a one-to-one hit of the brand"s iconic mascot and aesthetic.',
        styleCode: 'HM5838-300',
        colorway: 'Rough Green/Amarillo',
        releaseDate: '2024-11-21',
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 10,
        name: 'Air Rift',
        brand: 'Nike',
        price: 132.69,
        image: '/Assests/Nike/Lifestyle/Womens/ARP/arp.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'Sneaker or sandal? Let others sort it out while you kick back in style. Decked out in Parachute Beige hues, the Air Rift features a soft suede upper with hook-and-loop straps for easy adjusting. The split-toe design brings stability and comfort to every step while adding a playful aesthetic to your look. And because you deserve a little R&R, we added a plush foam midsole with Air cushioning in the heel to put your feet in holiday mode.',
        styleCode: 'HQ1474-200',
        colorway: 'Parachute Beige',
        releaseDate: '2025-03-08',
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 11,
        name: 'Cortez SE',
        brand: 'Nike',
        price: 101.24,
        image: '/Assests/Nike/Lifestyle/Womens/CSE/cse.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'You spoke. We listened. Based on your feedback, we"ve revamped the original Cortez while maintaining the retro appeal you know and love. It has a wider toe area and firmer side panels, so you can comfortably wear them all day without any warping. This special edition features smooth Sail leather and debossed branding for an elevated, monochromatic finish. Cortez fans—this one"s for you.',
        styleCode: 'HV6936-133',
        colorway: 'Sail',
        releaseDate: '2025-01-01',
        sizes: [7, 8, 9, 10, 11, 12]
    },
    {
        id: 12,
        name: 'Air Force 1 "07',
        brand: 'Nike',
        price: 132.69,
        image: '/Assests/Nike/Lifestyle/Womens/WAF1/waf1.jpg',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The legendary hoops-turned-streetwear staple returns in Pale Vanilla for a tonal take on the "82 classic. Tumbled leather and shaggy suede merge to create a balanced textural mash-up, while the matching sidewalls and outsole render a cohesive design. Of course the AF-1 comes complete with its signature cupsole design, round toe shape and Nike Air cushioning. Step into the Pale Vanilla AF-1 and coast away from the sea of triple whites. ',
        styleCode: 'IB4001-200',
        colorway: 'Pale Vanilla',
        releaseDate: '2025-03-20',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 13,
        name: 'Adidas Originals Handball Spezial',
        brand: 'Adidas',
        price: 100.00,
        image: '/Assests/Adidas/Lifestyle/Womens/AHS/ahs.png',
        category: 'Lifestyle',
        condition: 'New',
        description: 'Originally released in 1979 for elite handball players, the Adidas Originals Handball Spezial has transitioned into a stylish lifestyle sneaker. It features a premium suede upper, a reinforced heel for support, and a gum rubber outsole for superior traction. The low-profile design and classic T-toe styling make it both functional and fashionable',
        styleCode: 'IF6562',
        colorway: 'Brown/White/Gum',
        releaseDate: '2025-02-27',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 14,
        name: 'Adidas Originals Campus 00s',
        brand: 'Adidas',
        price: 110.00,
        image: '/Assests/Adidas/Lifestyle/Womens/AC/ac.png',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The Adidas Originals Campus 00s is a modern take on the classic Campus silhouette, inspired by the tranquility of Japanese Zen gardens. The soft suede upper features a textured design that mimics raked gravel and flowing water, complemented by debossed details and decorative stitching. A rubber outsole provides traction, while a textile lining ensures all-day comfort.',
        styleCode: 'JR3407-600',
        colorway: 'Warm Clay/Off White/Gum',
        releaseDate: '2025-01-24',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 15,
        name: 'Adidas Originals Samba OG',
        brand: 'Adidas',
        price: 100.00,
        image: '/Assests/Adidas/Lifestyle/Mens/AOS/aos.png',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The Adidas Samba OG is a timeless classic, featuring a white leather upper with black leather Three Stripes and a suede T-toe overlay in Clear Granite. The gum rubber sole provides superior traction, making it a staple for both casual and sport-inspired wear.',
        styleCode: 'B75806-100',
        colorway: 'White/Black/Clear Granite',
        releaseDate: '2023-01-27',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 16,
        name: 'Adidas Lightshift',
        brand: 'Adidas',
        price: 100.00,
        image: '/Assests/Adidas/Running/Mens/ALS/als.png',
        category: 'Running',
        condition: 'New',
        description: 'The adidas Lightshift Casual Shoes combine everyday comfort with a sleek, modern design. Featuring a breathable mesh upper with suede overlays, these sneakers provide a lightweight yet durable feel. The LIGHTMOTION midsole ensures soft cushioning, making them perfect for all-day wear. A rubber outsole delivers traction and stability, while the triple black colorway offers a minimalist, versatile look.',
        styleCode: 'JH9319-001',
        colorway: 'Core Black/Core Black/Core Black ',
        releaseDate: '2024-12-10',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 17,
        name: 'Adidas UltraBOOST 1.0',
        brand: 'Adidas',
        price: 200.00,
        image: '/Assests/Adidas/Running/Womens/AUB/aub.png',
        category: 'Running',
        condition: 'New',
        description: 'The adidas UltraBOOST 1.0 is a timeless classic in the sneaker world, delivering top-tier comfort, style, and performance. Featuring a Primeknit upper, this sneaker provides a flexible and breathable fit, adapting to your foot"s movement. The signature BOOST midsole ensures responsive energy return with every step, making it perfect for running or casual wear. A Continental™ rubber outsole enhances grip and durability, while the sleek black-and-white colorway makes it a versatile staple in any sneaker rotation.',
        styleCode: 'HQ4206-001',
        colorway: 'Core Black/Core Black/Footwear White ',
        releaseDate: '2024-02-15',
        sizes: [6, 7, 8, 9, 10, 11, 12, 13]
    },
    {
        id: 18,
        name: 'Anthony Edwards 1 "Iron Sharpens Iron" ',
        brand: 'Adidas',
        price: 139.76,
        image: '/Assests/Adidas/Basketball/Mens/AE1/ae1.png',
        category: 'Basketball',
        condition: 'New',
        description: 'The adidas Harden Vol. 9 "Cyber Metallic" is a signature basketball shoe designed for James Harden, featuring a breathable black mesh upper with a metallic gold synthetic cage, providing both style and support. The interior knit bootie ensures a snug fit, while the full-length Boost midsole offers responsive cushioning. A beige rubber outsole with multi-directional tread delivers durable traction on the court.',
        styleCode: 'JR2506',
        colorway: 'Cyber Metallic/Core Black/Lucid Red',
        releaseDate: '2024-12-14',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 19,
        name: 'Adidas Harden Vol. 9 "Cyber Metallic" ',
        brand: 'Adidas',
        price: 160.00,
        image: '/Assests/Adidas/Basketball/Mens/AH9/ah9.png',
        category: 'Basketball',
        condition: 'New',
        description: 'The "Iron Sharpens Iron" edition of the Anthony Edwards 1 Low showcases a sleek low-top design with a mesh upper and metallic overlays, providing both durability and breathability. The shoe incorporates a mesh inner bootie and padded collar for enhanced comfort. A protective toe cap and carbon fiber heel add to its structural integrity. The combination of BOOST and Lightstrike cushioning in the midsole ensures responsive comfort, while the rubber outsole offers excellent traction on the court. ',
        styleCode: 'JQ8898-036',
        colorway: 'Iron Metallic/Black/Solar Orange',
        releaseDate: '2024-12-14',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 20,
        name: 'UGG Classic Short II',
        brand: 'Deckers Brands',
        price: 180.00,
        image: '/Assests/DeckerBrands/Lifestyle/UGGC/uggc.png',
        category: 'Lifestyle',
        condition: 'New',
        description: 'The UGG Classic Short II Boots offer a timeless design with premium materials for warmth and comfort. Crafted from Twinface sheepskin with a suede upper, these boots feature a plush UGGpure™ wool lining for cozy insulation. The pre-treated upper helps resist moisture and stains, while the Treadlite by UGG™ outsole provides lightweight traction and durability. Ideal for casual wear, these boots deliver all-day comfort in cold weather.',
        styleCode: '1016223-251',
        colorway: 'Sand',
        releaseDate: '2023-12-14',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
    },
    {
        id: 21,
        name: 'HOKA Clifton 9 ',
        brand: 'Deckers Brands',
        price: 145.00,
        image: '/Assests/DeckerBrands/Running/HC9/hc9.png',
        category: 'Running',
        condition: 'New',
        description: 'The HOKA Clifton 9 is a lightweight and cushioned running shoe designed for neutral runners. It features an engineered mesh upper for breathability, a soft EVA foam midsole for plush cushioning, and a Meta-Rocker design for a smooth heel-to-toe transition. The extended heel tab provides easy on/off access, while the durable rubber outsole ensures excellent traction on various surfaces.',
        styleCode: '1127896-272',
        colorway: 'Oak/Alabaster',
        releaseDate: '2023-02-15',
        sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12]
    },
];

// Pagination configuration
const ITEMS_PER_PAGE = 9;
let currentPage = 1;

// Initialize products
function initProducts() {
    renderProducts(products, currentPage);
    initPagination();
}

// Render products with pagination
function renderProducts(productsToRender, page = 1) {
    const productGrid = document.getElementById('productGrid');
    const productCount = document.getElementById('productCount');
    
    if (!productGrid || !productCount) return;
    
    productCount.textContent = productsToRender.length;
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search display-1 text-muted"></i>
                <h3 class="mt-3">No products found</h3>
                <p class="text-muted">Try adjusting your filters or search criteria.</p>
            </div>
        `;
        return;
    }

    // Calculate pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = productsToRender.slice(startIndex, endIndex);
    
    let productsHTML = '';
    
    paginatedProducts.forEach(product => {
        productsHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="product-card">
                    <div class="position-relative">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <button class="btn btn-sm quick-view-btn" data-id="${product.id}">Quick View</button>
                    </div>
                    <div class="product-info">
                        <p class="product-brand">${product.brand}</p>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <span class="badge bg-secondary">${product.category}</span>
                        </div>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = productsHTML;
    
    // Add event listeners to buttons
    addProductButtonListeners();
}

// Initialize pagination
function initPagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    
    let paginationHTML = `
        <nav aria-label="Product navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                </li>
            </ul>
        </nav>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    document.querySelectorAll('.pagination .page-link').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const newPage = parseInt(this.getAttribute('data-page'));
            
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderProducts(products, currentPage);
                initPagination();
                
                // Scroll to top of product grid
                document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add event listeners to product buttons
function addProductButtonListeners() {
    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                openQuickView(product);
            }
        });
    });
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                openQuickView(product);
            }
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

// Initialize filters
function initFilters() {
    // Filter state
    let filters = {
        brands: [],
        categories: [],
        maxPrice: 1000,
        size: null
    };
    
    // Brand filters
    document.querySelectorAll('.filter-brand').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.brands.push(this.value);
            } else {
                filters.brands = filters.brands.filter(brand => brand !== this.value);
            }
            applyFilters();
        });
    });
    
    // Category filters
    document.querySelectorAll('.filter-category').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                filters.categories.push(this.value);
            } else {
                filters.categories = filters.categories.filter(category => category !== this.value);
            }
            applyFilters();
        });
    });
    
    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', function() {
            filters.maxPrice = parseInt(this.value);
            priceValue.textContent = `$${filters.maxPrice}`;
            applyFilters();
        });
    }
    
    // Size filters
    document.querySelectorAll('.size-btn').forEach(button => {
        button.addEventListener('click', function() {
            const size = parseFloat(this.getAttribute('data-size'));
            
            // Toggle active class
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                filters.size = null;
            } else {
                document.querySelectorAll('.size-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                filters.size = size;
            }
            
            applyFilters();
        });
    });
    
    // Clear all filters
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset filter state
            filters = {
                brands: [],
                categories: [],
                maxPrice: 1000,
                size: null
            };
            
            // Reset UI
            document.querySelectorAll('.filter-brand, .filter-category').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            if (priceRange) {
                priceRange.value = 500;
                priceValue.textContent = '$500';
            }
            
            document.querySelectorAll('.size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Render all products
            currentPage = 1;
            renderProducts(products, currentPage);
            initPagination();
        });
    }
    
    // Apply filters function
    function applyFilters() {
        let filteredProducts = [...products];
        
        // Filter by brand
        if (filters.brands.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                filters.brands.includes(product.brand)
            );
        }
        
        // Filter by category
        if (filters.categories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                filters.categories.includes(product.category)
            );
        }
        
        // Filter by price
        filteredProducts = filteredProducts.filter(product => 
            product.price <= filters.maxPrice
        );
        
        // Filter by size
        if (filters.size) {
            filteredProducts = filteredProducts.filter(product => 
                product.sizes.includes(filters.size)
            );
        }
        
        // Reset to first page when filtering
        currentPage = 1;
        
        // Render filtered products
        renderProducts(filteredProducts, currentPage);
        
        // Update pagination for filtered products
        updatePagination(filteredProducts);
    }
}

// Update pagination based on filtered products
function updatePagination(filteredProducts) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    
    let paginationHTML = `
        <nav aria-label="Product navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
                </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
                </li>
            </ul>
        </nav>
    `;

    paginationContainer.innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    document.querySelectorAll('.pagination .page-link').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const newPage = parseInt(this.getAttribute('data-page'));
            
            if (newPage >= 1 && newPage <= totalPages) {
                currentPage = newPage;
                renderProducts(filteredProducts, currentPage);
                updatePagination(filteredProducts);
                
                // Scroll to top of product grid
                document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize sort options
function initSortOptions() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedProducts = [...products];
        
        switch (sortValue) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            // Default is 'featured', no sorting needed
        }
        
        // Reset to first page when sorting
        currentPage = 1;
        
        // Apply any active filters to the sorted products
        applyActiveFilters(sortedProducts);
    });
    
    // Function to apply active filters to sorted products
    function applyActiveFilters(sortedProducts) {
        let filteredProducts = [...sortedProducts];
        
        // Get active brand filters
        const activeBrands = [];
        document.querySelectorAll('.filter-brand:checked').forEach(checkbox => {
            activeBrands.push(checkbox.value);
        });
        
        // Get active category filters
        const activeCategories = [];
        document.querySelectorAll('.filter-category:checked').forEach(checkbox => {
            activeCategories.push(checkbox.value);
        });
        
        // Get active price filter
        const maxPrice = parseInt(document.getElementById('priceRange').value);
        
        // Get active size filter
        let activeSize = null;
        const activeSizeBtn = document.querySelector('.size-btn.active');
        if (activeSizeBtn) {
            activeSize = parseFloat(activeSizeBtn.getAttribute('data-size'));
        }
        
        // Apply brand filter
        if (activeBrands.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                activeBrands.includes(product.brand)
            );
        }
        
        // Apply category filter
        if (activeCategories.length > 0) {
            filteredProducts = filteredProducts.filter(product => 
                activeCategories.includes(product.category)
            );
        }
        
        // Apply price filter
        filteredProducts = filteredProducts.filter(product => 
            product.price <= maxPrice
        );
        
        // Apply size filter
        if (activeSize) {
            filteredProducts = filteredProducts.filter(product => 
                product.sizes.includes(activeSize)
            );
        }
        
        // Render filtered and sorted products
        renderProducts(filteredProducts, currentPage);
        updatePagination(filteredProducts);
    }
}

// Initialize sort options
function initSortOptions() {
    const sortOptions = document.getElementById('sortOptions');
    if (!sortOptions) return;
    
    sortOptions.addEventListener('change', function() {
        const sortValue = this.value;
        let sortedProducts = [...products];
        
        switch (sortValue) {
            case 'priceAsc':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'priceDesc':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sortedProducts.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                break;
            // Default is 'featured', no sorting needed
        }
        
        renderProducts(sortedProducts, currentPage);
    });
}

// Initialize quick view
function initQuickView() {
    // Initialize the modal
    const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    
    // Add to cart button in quick view
    const quickViewAddToCart = document.getElementById('quickViewAddToCart');
    if (quickViewAddToCart) {
        quickViewAddToCart.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                // Get selected size
                const selectedSize = document.querySelector('#quickViewSizes .size-btn.active');
                if (!selectedSize) {
                    showNotification('Please select a size', 'error');
                    return;
                }
                
                const size = parseFloat(selectedSize.getAttribute('data-size'));
                
                // Add to cart
                addToCart(product, size);
                
                // Close modal
                quickViewModal.hide();
            }
        });
    }
}

// Open quick view modal
function openQuickView(product) {
    // Fill modal with product details
    document.getElementById('quickViewTitle').textContent = product.name;
    document.getElementById('quickViewName').textContent = product.name;
    document.getElementById('quickViewBrand').textContent = product.brand;
    document.getElementById('quickViewPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('quickViewCondition').textContent = product.condition;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewMainImage').src = product.image;
    document.getElementById('quickViewStyleCode').textContent = product.styleCode;
    document.getElementById('quickViewColorway').textContent = product.colorway;
    document.getElementById('quickViewReleaseDate').textContent = product.releaseDate;
    
    // Set product ID on add to cart button
    document.getElementById('quickViewAddToCart').setAttribute('data-product-id', product.id);
    
    // Render sizes
    const sizesContainer = document.getElementById('quickViewSizes');
    let sizesHTML = '';
    
    product.sizes.forEach(size => {
        sizesHTML += `<button class="size-btn" data-size="${size}">${size}</button>`;
    });
    
    sizesContainer.innerHTML = sizesHTML;
    
    // Add event listeners to size buttons
    document.querySelectorAll('#quickViewSizes .size-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('#quickViewSizes .size-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Show modal
    const quickViewModal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    quickViewModal.show();
}

// Initialize search functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const searchResultsDropdown = document.querySelector('.search-results-dropdown');
    
    if (!searchInput || !searchBtn || !searchResultsDropdown) return;
    
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
    
    if (!cartCount || !cartItems) return;
    
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart dropdown
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