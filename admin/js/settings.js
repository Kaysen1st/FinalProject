// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is authenticated
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (!admin || !admin.isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialize settings page
    initSettingsPage();
});

// Initialize settings page
function initSettingsPage() {
    // Load current settings
    loadSettings();
    
    // Initialize settings form
    initSettingsForm();
    
    // Initialize admin profile form
    initAdminProfileForm();
    
    // Initialize password change form
    initPasswordForm();
}

// Load settings
function loadSettings() {
    // Get settings from shared repository or localStorage
    const settings = window.sharedSettingsRepo?.get() || 
                    JSON.parse(localStorage.getItem('storeSettings')) || 
                    getDefaultSettings();
    
    // Fill settings form
    fillSettingsForm(settings);
}

// Get default settings
function getDefaultSettings() {
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

// Fill settings form with current settings
function fillSettingsForm(settings) {
    // Store settings
    document.getElementById('storeName').value = settings.storeName || '';
    document.getElementById('storeTagline').value = settings.storeTagline || '';
    document.getElementById('logoPreview').src = settings.logo || '';
    document.getElementById('currency').value = settings.currency || 'USD';
    document.getElementById('taxRate').value = settings.taxRate || 0.08;
    document.getElementById('freeShippingThreshold').value = settings.freeShippingThreshold || 200;
    document.getElementById('standardShippingRate').value = settings.standardShippingRate || 9.99;
    document.getElementById('productsPerPage').value = settings.productsPerPage || 12;
    
    // Feature toggles
    document.getElementById('showOutOfStockProducts').checked = settings.showOutOfStockProducts !== false;
    document.getElementById('enableUserRegistration').checked = settings.enableUserRegistration !== false;
    document.getElementById('enableReviews').checked = settings.enableReviews !== false;
    document.getElementById('enableWishlist').checked = settings.enableWishlist !== false;
    
    // Social links
    if (settings.socialLinks) {
        document.getElementById('facebookLink').value = settings.socialLinks.facebook || '';
        document.getElementById('instagramLink').value = settings.socialLinks.instagram || '';
        document.getElementById('twitterLink').value = settings.socialLinks.twitter || '';
    }
    
    // Contact information
    document.getElementById('contactEmail').value = settings.contactEmail || '';
    document.getElementById('contactPhone').value = settings.contactPhone || '';
    document.getElementById('storeAddress').value = settings.storeAddress || '';
}

// Initialize settings form
function initSettingsForm() {
    const settingsForm = document.getElementById('storeSettingsForm');
    const logoInput = document.getElementById('logoUpload');
    const logoPreview = document.getElementById('logoPreview');
    
    // Handle logo upload
    if (logoInput && logoPreview) {
        logoInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    logoPreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle settings form submission
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const settings = {
                storeName: document.getElementById('storeName').value,
                storeTagline: document.getElementById('storeTagline').value,
                logo: logoPreview.src,
                currency: document.getElementById('currency').value,
                taxRate: parseFloat(document.getElementById('taxRate').value),
                freeShippingThreshold: parseFloat(document.getElementById('freeShippingThreshold').value),
                standardShippingRate: parseFloat(document.getElementById('standardShippingRate').value),
                productsPerPage: parseInt(document.getElementById('productsPerPage').value),
                showOutOfStockProducts: document.getElementById('showOutOfStockProducts').checked,
                enableUserRegistration: document.getElementById('enableUserRegistration').checked,
                enableReviews: document.getElementById('enableReviews').checked,
                enableWishlist: document.getElementById('enableWishlist').checked,
                socialLinks: {
                    facebook: document.getElementById('facebookLink').value,
                    instagram: document.getElementById('instagramLink').value,
                    twitter: document.getElementById('twitterLink').value
                },
                contactEmail: document.getElementById('contactEmail').value,
                contactPhone: document.getElementById('contactPhone').value,
                storeAddress: document.getElementById('storeAddress').value
            };
            
            // Save settings
            saveSettings(settings);
        });
    }
}

// Save settings
function saveSettings(settings) {
    // Save to shared repository if available
    if (window.sharedSettingsRepo) {
        window.sharedSettingsRepo.save(settings);
    } else {
        // Otherwise save to localStorage
        localStorage.setItem('storeSettings', JSON.stringify(settings));
    }
    
    // Dispatch settings updated event
    document.dispatchEvent(new CustomEvent('settings:updated', {
        detail: { settings }
    }));
    
    // Show success message
    showNotification('Settings saved successfully', 'success');
}

// Initialize admin profile form
function initAdminProfileForm() {
    const profileForm = document.getElementById('adminProfileForm');
    const adminAvatarInput = document.getElementById('adminAvatarUpload');
    const adminAvatarPreview = document.getElementById('adminAvatarPreview');
    
    // Get admin data
    const admin = JSON.parse(localStorage.getItem('admin')) || {};
    
    // Fill profile form
    if (admin) {
        document.getElementById('adminName').value = admin.name || '';
        document.getElementById('adminEmail').value = admin.email || '';
        
        if (admin.avatar) {
            adminAvatarPreview.src = admin.avatar;
            adminAvatarPreview.classList.remove('d-none');
            document.querySelector('.admin-avatar-placeholder').classList.add('d-none');
        }
    }
    
    // Handle avatar upload
    if (adminAvatarInput && adminAvatarPreview) {
        adminAvatarInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    adminAvatarPreview.src = e.target.result;
                    adminAvatarPreview.classList.remove('d-none');
                    document.querySelector('.admin-avatar-placeholder').classList.add('d-none');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Handle profile form submission
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('adminName').value;
            const email = document.getElementById('adminEmail').value;
            const avatar = adminAvatarPreview.src;
            
            // Update admin data
            const updatedAdmin = {
                ...admin,
                name,
                email,
                avatar: adminAvatarPreview.classList.contains('d-none') ? null : avatar
            };
            
            // Save admin data
            localStorage.setItem('admin', JSON.stringify(updatedAdmin));
            
            // Update UI
            document.querySelectorAll('.admin-name').forEach(el => {
                el.textContent = name;
            });
            
            // Show success message
            showNotification('Profile updated successfully', 'success');
        });
    }
}

// Initialize password change form
function initPasswordForm() {
    const passwordForm = document.getElementById('changePasswordForm');
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Get admin data
            const admin = JSON.parse(localStorage.getItem('admin')) || {};
            
            // Validate current password (in a real app, this would be done server-side)
            if (currentPassword !== 'admin123') {
                showNotification('Current password is incorrect', 'error');
                return;
            }
            
            // Validate new password
            if (newPassword.length < 8) {
                showNotification('New password must be at least 8 characters long', 'error');
                return;
            }
            
            // Validate password confirmation
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }
            
            // Update admin data with new password (in a real app, this would be hashed)
            // For demo purposes, we're just showing success message
            showNotification('Password changed successfully', 'success');
            
            // Reset form
            passwordForm.reset();
        });
    }
}