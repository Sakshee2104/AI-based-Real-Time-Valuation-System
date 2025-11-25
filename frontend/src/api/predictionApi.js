const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Helper function to prepare the Authorization header with the JWT token
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    // This is the crucial line for resolving the 422 errors after login
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const predictPrice = async (formData) => {
    // Calls POST /api/predict
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'Prediction failed. Check network and authentication.');
    }
    return data; // { predicted_price, log_id }
};

export const fetchCMA = async (location, bhk) => {
    // Calls GET /api/cma
    // Note: CMA requires a valid JWT token (@jwt_required())
    const params = new URLSearchParams({ location, bhk });
    const response = await fetch(`${API_BASE_URL}/cma?${params.toString()}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'CMA fetch failed. Authentication required.');
    }
    return data; // Array of similar properties
};

export const fetchPredictionHistory = async () => {
    // Calls GET /api/user/predictions (Used by UserDashboard.js)
    const response = await fetch(`${API_BASE_URL}/user/predictions`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || 'Failed to fetch prediction history.');
    }
    return data;
};