// This file contains functions for user authentication, including login and logout functionalities. 
// It checks user credentials and manages session storage.

const users = [
    { username: 'admin', password: 'admin123' },
    { username: 'user', password: 'user123' }
];

export function login(username, password) {
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('username', username);
        return true;
    }
    return false;
}

export function logout() {
    sessionStorage.removeItem('authenticated');
    sessionStorage.removeItem('username');
}

export function isAuthenticated() {
    return sessionStorage.getItem('authenticated') === 'true';
}

export function getUsername() {
    return sessionStorage.getItem('username');
}