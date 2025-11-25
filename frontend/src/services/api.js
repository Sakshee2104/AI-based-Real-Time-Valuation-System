// This file centralizes all data fetching and mutation logic.
// In a real application, replace these mock functions with actual 'fetch' or 'axios' calls
// targeting your Python backend routes (e.g., http://localhost:5000/api/v1/properties).

// --- Mock Data ---
const MOCK_LISTINGS = [
    { id: 101, title: 'Luxury 3BHK', location: 'Whitefield', price: '98L', bhk: '3 BHK', area: 1500, status: 'Active', imageUrl: 'https://picsum.photos/seed/list1/400/250' },
    { id: 102, title: 'Compact 2BHK', location: 'Sarjapur', price: '65L', bhk: '2 BHK', area: 1100, status: 'Active', imageUrl: 'https://picsum.photos/seed/list2/400/250' },
    { id: 103, title: 'Premium 4BHK', location: 'Koramangala', price: '1.8Cr', bhk: '4 BHK', area: 2200, status: 'Active', imageUrl: 'https://picsum.photos/seed/list3/400/250' },
    { id: 104, title: 'Modern 3BHK', location: 'Whitefield', price: '85L', bhk: '3 BHK', area: 1400, status: 'Active', imageUrl: 'https://picsum.photos/seed/list4/400/250' },
];

import axios from "axios";
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || "/", timeout: 15000 });

export async function createProperty(data, token) {
  const res = await api.post("/api/add-property", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function fetchOwnerProperties(token) {
  const res = await api.get("/api/owner/properties", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function updateProperty(id, data, token) {
  const res = await api.put(`/api/property/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function changePropertyStatus(id, status, token) {
  const res = await api.post(`/api/property/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function sendInquiry(payload, token) {
  const res = await api.post("/api/contact-agent", payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function fetchOwnerInquiries(token) {
  const res = await api.get("/api/owner/inquiries", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

// --- Owner Dashboard API Functions ---

export const fetchOwnerData = async (ownerId) => {
    // Example: fetch(`/api/v1/owners/${ownerId}/dashboard`)
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        totalListings: MOCK_LISTINGS.length,
        totalInquiries: 32,
        popularProperty: '3BHK Whitefield',
        hot_markets: [{ location: 'Sarjapur', count: 45 }, { location: 'Whitefield', count: 30 }],
        recent_inquiries: [
            { id: 1, buyer: 'Krupesh R.', prop: '3BHK Whitefield', date: 'Oct 25', status: 'Unread', source: 'Portal', message: 'I need a viewing.' },
            { id: 2, buyer: 'Anonymous', prop: '2BHK Koramangala', date: 'Oct 24', status: 'Replied', source: 'Facebook', message: 'What is the exact price?' },
        ],
        listings: [
            ...MOCK_LISTINGS,
            { id: 5, title: '5BHK HSR Layout', price: '2.5Cr', status: 'Pending' },
        ]
    };
};

export const updateListingStatus = async (listingId, newStatus) => {
    // Example: fetch(`/api/v1/properties/${listingId}/status`, { method: 'POST', body: JSON.stringify({ status: newStatus }) })
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`[API MOCK] Listing ${listingId} status updated to: ${newStatus}`);
    return { success: true, newStatus };
};

// --- Buyer Dashboard API Functions ---

export const fetchUserData = async (userId) => {
    // Example: fetch(`/api/v1/users/${userId}/dashboard`)
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
        stats: { predictions: 5, inquiries: 3, favorites: 7 },
        history: [
            { id: 1, location: 'Hebbal', bhk: 2, price: 72.00, area: 1200, date: '10/29/2025' },
            { id: 2, location: 'Whitefield', bhk: 3, price: 85.50, area: 1600, date: '10/29/2025' }
        ],
        inquiries: [
            { id: 1, prop: '3BHK HSR', agent: 'Agent Bob', date: 'Oct 20', status: 'Pending' }, 
            { id: 2, prop: '4BHK Marathalli', agent: 'Owner Smith', date: 'Oct 15', status: 'Replied' }
        ],
        favorites: [
            { id: 1, price: '₹98L', location: 'Sarjapur', bhk: 3, area: 1300, imageUrl: 'https://picsum.photos/seed/fav1/400/250' },
            { id: 2, price: '₹1.2Cr', location: 'Koramangala', bhk: 4, area: 1800, imageUrl: 'https://picsum.photos/seed/fav2/400/250' }
        ],
    };
};

// --- Property Search API Functions ---

export const fetchMarketFeatures = async () => {
    // Example: fetch(`/api/v1/analytics/market-features`)
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return {
        popularBHKs: ['2 BHK', '3 BHK', '4 BHK'],
        trendingLocalities: [
            { name: 'Whitefield', count: 120, avgPrice: 95 }, 
            { name: 'Koramangala', count: 80, avgPrice: 160 },
            { name: 'Sarjapur', count: 150, avgPrice: 75 }
        ],
    };
};

export const fetchListingsByFilters = async (filters) => {
    // Example: fetch(`/api/v1/properties?location=${filters.location}&bhk=${filters.bhk}`)
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Simple filter application on mock data
    const filtered = MOCK_LISTINGS.filter(listing => {
        const matchesLocation = !filters.location || listing.location.toLowerCase().includes(filters.location.toLowerCase());
        const matchesBhk = !filters.bhk || listing.bhk === filters.bhk;
        return matchesLocation && matchesBhk; 
    });

    return filtered;
};

export async function searchProperties({ city, q, min_price, max_price, type, bhk, page, per_page, sort } = {}) {
  const params = { city, q, min_price, max_price, type, bhk, page, per_page, sort };
  const res = await api.get("/api/properties", { params });
  return res.data;
}

export async function getPropertyDetails(id) {
  const res = await api.get(`/api/properties/${id}`);
  return res.data;
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/api/upload-image", form, { headers: { "Content-Type": "multipart/form-data" }});
  return res.data;
}

export default api;
