// Using an environment variable for the API base URL is a best practice.
// It allows you to easily change the API endpoint for different environments (development, production)
// without changing the code.
// For a Create React App, you would define this in a .env file as REACT_APP_API_BASE_URL=...
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000/api';

/**
 * Creates the authorization headers for a request.
 * Retrieves the JWT token from localStorage.
 * @returns {HeadersInit} The authorization headers.
 */
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

/**
 * Handles the response from the fetch API.
 * Checks for .ok status and throws an error if not successful.
 * @param {Response} response - The fetch Response object.
 * @returns {Promise<any>} The parsed JSON data.
 * @throws {Error} Throws an error with a message from the API or a status code.
 */
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        // Use the error message from the API response if available, otherwise use a generic message.
        throw new Error(data.msg || data.message || `API Error: ${response.statusText} (Status: ${response.status})`);
    }
    return data;
};

// --- General Query Functions ---

/**
 * Submits a new general query from a user.
 * @param {string} subject - The subject of the query.
 * @param {string} message - The main content of the query.
 * @returns {Promise<any>} The API response (e.g., the created query object).
 */
export const submitGeneralQuery = async (subject, message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/query/submit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ subject, message }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error submitting general query:', error);
        // Re-throw the error so the calling component can handle it (e.g., show a toast notification)
        throw error;
    }
};

// --- Owner/Admin Functions ---

/**
 * Fetches all queries for the Owner Dashboard.
 * Assumes this endpoint is protected and only accessible by owners/admins.
 * @returns {Promise<any>} An array of all query objects.
 */
export const fetchAllQueries = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/query/list`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching all queries:', error);
        throw error;
    }
};

/**
 * Submits a reply to a specific query (by Owner/Admin).
 * Renamed from replyToQuery to match import in OwnerDashboard.js
 * @param {string} queryId - The ID of the query to reply to.
 * @param {string} replyMessage - The content of the reply.
 * @returns {Promise<any>} The updated query object with the new reply.
 */
export const submitReplyToQuery = async (queryId, replyMessage) => {
    try {
        const response = await fetch(`${API_BASE_URL}/query/${queryId}/reply`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ message: replyMessage }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error submitting reply to query:', error);
        throw error;
    }
};

/**
 * Updates the status of a specific query (e.g., "pending", "in-progress", "closed").
 * @param {string} queryId - The ID of the query to update.
 * @param {string} status - The new status.
 * @returns {Promise<any>} The updated query object.
 */
export const updateQueryStatus = async (queryId, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/query/${queryId}/status`, {
            method: 'PUT', // PUT or PATCH is typically used for updates
            headers: getAuthHeaders(),
            body: JSON.stringify({ status }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error updating query status:', error);
        throw error;
    }
};

// --- User-Specific Functions ---

/**
 * Fetches all queries submitted by the currently logged-in user.
 * @returns {Promise<any>} An array of the user's query objects.
 */
export const fetchUserQueries = async () => {
    try {
        // Assuming a new endpoint like '/my-list' that uses the auth token
        // to find queries for the logged-in user.
        const response = await fetch(`${API_BASE_URL}/query/my-list`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching user-specific queries:', error);
        throw error;
    }
};

/**
 * Fetches the details of a single query by its ID.
 * This could be used by both the user who submitted it or an admin.
 * @param {string} queryId - The ID of the query.
 *Details
 * @returns {Promise<any>} The detailed query object.
 */
export const fetchQueryById = async (queryId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/query/${queryId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('Error fetching query by ID:', error);
        throw error;
    }
};