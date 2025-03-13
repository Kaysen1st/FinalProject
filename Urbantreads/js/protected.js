// Simple protection for pages that require authentication
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
        // Save the current URL to redirect back after login
        sessionStorage.setItem('redirectUrl', window.location.href);
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});