// c:\real_estate_project\frontend\src\utils\dummyData.js

// --- Owner/Agent Dashboard Data ---
export const dummyOwnerStats = {
    totalListings: 15,
    totalInquiries: 32,
    popularProperty: '3BHK Whitefield',
    // Data for Hot Markets chart/list
    hot_markets: [{ location: 'Sarjapur', count: 45 }, { location: 'Whitefield', count: 30 }],
    
    // Data for Incoming Inquiries tab
    recent_inquiries: [
         { id: 1, buyer: 'Krupesh patel .', prop: '3BHK Whitefield', date: 'Oct 25', status: 'Unread', message: 'I need a viewing.' },
         { id: 2, buyer: 'arya vardhan', prop: '2BHK Koramangala', date: 'Oct 24', status: 'Replied', message: 'What is the exact price?' },
    ],
    // Data for My Listings tab
    listings: [
        { id: 1, title: '3BHK Whitefield', price: '85L', status: 'Active' },
        { id: 2, title: '4BHK Koramangala', price: '1.8Cr', status: 'Pending' },
    ]
};

// --- User/Buyer Dashboard Data ---
export const dummyUserStats = { predictions: 5, inquiries: 3, favorites: 7 };

// Data for User Prediction History Table
export const dummyHistory = [
    { id: 1, location: 'Hebbal', bhk: 2, price: 72.00, area: 1200, date: '10/29/2025' },
    { id: 2, location: 'Whitefield', bhk: 3, price: 85.50, area: 1600, date: '10/29/2025' }
];

// Data for Wishlist/CMA Cards (used by ListingCard)
export const dummyListingCards = [
    { id: 1, price: '₹98L', location: 'Sarjapur', bhk: 3, area: 1300, imageUrl: 'https://picsum.photos/seed/fav1/400/250', size: '3 BHK', description: 'Luxury apartment with high returns.' },
    { id: 2, price: '₹1.4Cr', location: 'Hebbal', bhk: 4, area: 2500, imageUrl: 'https://picsum.photos/seed/fav2/400/250', size: '4 BHK', description: 'Premium villa near the airport road.' },
];