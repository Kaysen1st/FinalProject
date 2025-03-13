/**
 * UrbanTreads Authentication Service
 * Handles user authentication, tokens, sessions and cookies
 */

const AuthService = {
    // Token and session duration (in milliseconds)
    TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
    SESSION_EXPIRY: 30 * 60 * 1000, // 30 minutes
    
    /**
     * Login a user and set up authentication
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {boolean} rememberMe - Whether to remember the user
     * @returns {Promise<Object>} - User data
     */
    login: function(email, password, rememberMe = false) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // In a real app, this would be a server validation
                if (!email || !password) {
                    reject(new Error('Email and password are required'));
                    return;
                }
                
                // Create user object with token
                const userData = {
                    id: 'usr_' + Date.now(),
                    name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                    email: email,
                    isLoggedIn: true,
                    firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                    lastName: '',
                    avatar: '../assets/default-avatar.jpg',
                    token: this.generateToken(),
                    tokenExpiry: Date.now() + this.TOKEN_EXPIRY,
                    showSaleBanner: true,
                    lastActive: Date.now()
                };
                
                // Save authentication data
                this.setAuthData(userData, rememberMe);
                
                // Resolve with user data (without sensitive info)
                const publicUserData = { ...userData };
                delete publicUserData.token;
                delete publicUserData.tokenExpiry;
                
                resolve(publicUserData);
            }, 1000);
        });
    },
    
    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} - New user data
     */
    register: function(userData) {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                // Validate required fields
                if (!userData.email || !userData.password) {
                    reject(new Error('Email and password are required'));
                    return;
                }
                
                // Create new user with token
                const newUser = {
                    id: 'usr_' + Date.now(),
                    name: userData.firstName || userData.email.split('@')[0],
                    email: userData.email,
                    isLoggedIn: true,
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    avatar: '../assets/default-avatar.jpg',
                    token: this.generateToken(),
                    tokenExpiry: Date.now() + this.TOKEN_EXPIRY,
                    showSaleBanner: true,
                    lastActive: Date.now()
                };
                
                // Save authentication data
                this.setAuthData(newUser, userData.rememberMe);
                
                // Resolve with user data (without sensitive info)
                const publicUserData = { ...newUser };
                delete publicUserData.token;
                delete publicUserData.tokenExpiry;
                
                resolve(publicUserData);
            }, 1500);
        });
    },
    
    /**
     * Logout the current user
     */
    logout: function() {
        // Clear all auth data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        
        // Clear cookies
        this.setCookie('authToken', '', -1);
        this.setCookie('userEmail', '', -1);
        
        // Return to login page
        window.location.href = 'login.html';
    },
    
    /**
     * Check if user is authenticated
     * @returns {boolean} - Whether user is authenticated
     */
    isAuthenticated: function() {
        // Try to get auth data from various sources
        const user = this.getAuthData();
        
        if (!user) return false;
        
        // Check if token is expired
        if (user.tokenExpiry && user.tokenExpiry < Date.now()) {
            this.logout();
            return false;
        }
        
        // Update last active timestamp
        this.updateLastActive();
        
        return true;
    },
    
    /**
     * Get the current authenticated user
     * @returns {Object|null} - User data or null if not authenticated
     */
    getCurrentUser: function() {
        // Check authentication first
        if (!this.isAuthenticated()) return null;
        
        // Get user data
        return this.getAuthData();
    },
    
    /**
     * Update the user's last active timestamp
     */
    updateLastActive: function() {
        const user = this.getAuthData();
        if (!user) return;
        
        // Update last active timestamp
        user.lastActive = Date.now();
        
        // Save updated user data
        if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(user));
        }
        if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(user));
        }
    },
    
    /**
     * Check if session is expired and handle accordingly
     * @returns {boolean} - Whether session is active
     */
    checkSession: function() {
        const user = this.getAuthData();
        if (!user) return false;
        
        const now = Date.now();
        
        // Check token expiry
        if (user.tokenExpiry && user.tokenExpiry < now) {
            this.logout();
            return false;
        }
        
        // Check session expiry (based on last activity)
        if (user.lastActive && (now - user.lastActive) > this.SESSION_EXPIRY) {
            // Session expired, show re-authentication modal
            this.showReauthModal();
            return false;
        }
        
        return true;
    },
    
    /**
     * Show re-authentication modal when session expires
     */
    showReauthModal: function() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="reauthModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Session Expired</h5>
                        </div>
                        <div class="modal-body">
                            <p>Your session has expired due to inactivity. Please login again to continue.</p>
                            <div class="form-group mb-3">
                                <label for="reauthPassword" class="form-label">Password</label>
                                <input type="password" class="form-control" id="reauthPassword" placeholder="Enter your password">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" id="reauthLogout">Logout</button>
                            <button type="button" class="btn btn-primary" id="reauthSubmit">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Append modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show the modal
        const reauthModal = new bootstrap.Modal(document.getElementById('reauthModal'));
        reauthModal.show();
        
        // Handle re-authentication
        document.getElementById('reauthSubmit').addEventListener('click', () => {
            const password = document.getElementById('reauthPassword').value;
            
            if (!password) {
                alert('Please enter your password');
                return;
            }
            
            // Get current user
            const user = this.getAuthData();
            
            // In a real app, this would verify with the server
            // For demo purposes, we'll just accept any password
            
            // Update token and expiry
            user.token = this.generateToken();
            user.tokenExpiry = Date.now() + this.TOKEN_EXPIRY;
            user.lastActive = Date.now();
            
            // Save updated user data
            this.setAuthData(user, true);
            
            // Hide modal
            reauthModal.hide();
            document.getElementById('reauthModal').remove();
        });
        
        // Handle logout
        document.getElementById('reauthLogout').addEventListener('click', () => {
            this.logout();
        });
    },
    
    /**
     * Generate a random token
     * @returns {string} - Random token
     */
    generateToken: function() {
        // In a real app, this would be a JWT from the server
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        for (let i = 0; i < 32; i++) {
            token += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return token;
    },
    
    /**
     * Set authentication data in storage and cookies
     * @param {Object} userData - User data with token
     * @param {boolean} rememberMe - Whether to use persistent storage
     */
    setAuthData: function(userData, rememberMe) {
        // Save token and user separately
        const token = userData.token;
        
        if (rememberMe) {
            // Use localStorage for persistent storage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('authToken', token);
            
            // Set cookies (30 days expiry)
            this.setCookie('authToken', token, 30);
            this.setCookie('userEmail', userData.email, 30);
        } else {
            // Use sessionStorage for session-only storage
            sessionStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('authToken', token);
        }
    },
    
    /**
     * Get authentication data from storage or cookies
     * @returns {Object|null} - User data or null if not found
     */
    getAuthData: function() {
        // Try localStorage first
        let userData = JSON.parse(localStorage.getItem('user'));
        
        // If not in localStorage, try sessionStorage
        if (!userData) {
            userData = JSON.parse(sessionStorage.getItem('user'));
        }
        
        // If not in sessionStorage, try to reconstruct from cookies
        if (!userData) {
            const token = this.getCookie('authToken');
            const email = this.getCookie('userEmail');
            
            if (token && email) {
                // Create minimal user object
                userData = {
                    email: email,
                    token: token,
                    isLoggedIn: true,
                    name: email.split('@')[0],
                    lastActive: Date.now()
                };
                
                // Save to sessionStorage
                sessionStorage.setItem('user', JSON.stringify(userData));
                sessionStorage.setItem('authToken', token);
            }
        }
        
        return userData;
    },
    
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Cookie expiry in days
     */
    setCookie: function(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; SameSite=Strict';
    },
    
    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} - Cookie value or null if not found
     */
    getCookie: function(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }
};

// Export to global scope for use in other scripts
window.AuthService = AuthService;