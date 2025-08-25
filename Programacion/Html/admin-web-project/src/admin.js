// File: /admin-web-project/admin-web-project/src/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is authenticated
    if (!isAuthenticated()) {
        window.location.href = 'index.html'; // Redirect to login if not authenticated
    }

    // Load admin data
    loadAdminData();

    // Event listeners for admin actions
    document.getElementById('logoutButton').addEventListener('click', logout);
});

function isAuthenticated() {
    // Check if the user is authenticated (e.g., check session storage)
    return sessionStorage.getItem('authenticated') === 'true';
}

function loadAdminData() {
    // Fetch and display admin-specific data
    // This could be an API call to get data from the server
    const adminData = {
        users: 100,
        sales: 5000,
        revenue: 20000
    };

    document.getElementById('adminUsers').innerText = adminData.users;
    document.getElementById('adminSales').innerText = adminData.sales;
    document.getElementById('adminRevenue').innerText = adminData.revenue;
}

function logout() {
    // Clear session storage and redirect to login
    sessionStorage.removeItem('authenticated');
    window.location.href = 'index.html';
}