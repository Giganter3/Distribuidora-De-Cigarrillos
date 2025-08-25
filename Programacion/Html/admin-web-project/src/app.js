// File: /admin-web-project/admin-web-project/src/app.js

import { login } from './utils/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            login(username, password)
                .then((response) => {
                    if (response.success) {
                        window.location.href = 'admin.html';
                    } else {
                        alert('Login failed: ' + response.message);
                    }
                })
                .catch((error) => {
                    console.error('Error during login:', error);
                    alert('An error occurred. Please try again.');
                });
        });
    }
});