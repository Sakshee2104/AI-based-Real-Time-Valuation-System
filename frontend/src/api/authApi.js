const API_BASE_URL = 'http://127.0.0.1:5000/api';

const getAuthHeaders = (tokenOverride) => {
    const token = tokenOverride || localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json' };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
};

// Helper to handle response logic consistently
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || data.message || 'An API error occurred.');
    }
    return data;
};

export const loginUser = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const registerUser = async (userData) => {
    // CRITICAL FIX: The Register API call must use this format to return a reliable promise
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    return handleResponse(response); // Returns 201 success signal
};

export const verifyToken = async (token) => {
    const headers = getAuthHeaders(token);
    
    if (!headers.Authorization) {
         throw new Error("No token found to verify.");
    }
    
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
        method: 'GET',
        headers: headers,
    });
    return handleResponse(response);
};