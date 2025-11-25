const API_BASE_URL = 'http://127.0.0.1:5000/api';

// --- Helper Functions ---

const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.msg || data.message || 'An API error occurred.');
    }
    return data;
};

// --- Prediction and CMA Functions ---

export const predictPrice = async (formData) => {
    // Calls POST /api/predict (Your trained ML Model)
    const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
    });
    return handleResponse(response);
};

export const fetchCMA = async (location, bhk) => {
    // Calls GET /api/cma (Fetches listings from your DB)
    const params = new URLSearchParams({ location, bhk }).toString();
    const response = await fetch(`${API_BASE_URL}/cma?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

// --- Property Listing Functions (CRITICAL FIX) ---

export const fetchProperties = async (filters = {}) => {
    // Calls GET /api/properties (for the main Property Browsing page)
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/properties?${params}`, {
        method: 'GET',
        headers: getAuthHeaders(), // Use auth headers
    });
    return handleResponse(response);
};

export const fetchPropertyDetails = async (propertyId) => {
    // Calls GET /api/property/{id} (for the detail page)
    const response = await fetch(`${API_BASE_URL}/property/${propertyId}`, {
        method: 'GET',
        headers: getAuthHeaders(), // Use auth headers
    });
    return handleResponse(response);
};

// --- Inquiry and Agent Functions ---

export const submitInquiry = async (propertyId, message) => {
    // Calls POST /api/contact-agent
    const response = await fetch(`${API_BASE_URL}/contact-agent`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ property_id: propertyId, message }),
    });
    return handleResponse(response);
};

export const markInquiryResponded = async (inquiryId) => {
    // Calls PUT /api/inquiries/respond/{inquiry_id}
    const response = await fetch(`${API_BASE_URL}/inquiries/respond/${inquiryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const addProperty = async (propertyData) => {
    // Calls POST /api/add-property
    const response = await fetch(`${API_BASE_URL}/add-property`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
};

export const fetchInquiries = async () => {
    // Calls GET /api/inquiries
    const response = await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const fetchPredictionHistory = async () => {
    // Calls GET /api/user/predictions
    const response = await fetch(`${API_BASE_URL}/user/predictions`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};