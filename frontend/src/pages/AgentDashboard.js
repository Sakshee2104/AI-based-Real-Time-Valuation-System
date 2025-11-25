import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// These API calls would be implemented in propertyApi.js on the frontend
// import { fetchAgentListings, fetchInquiries, addProperty } from '../api/propertyApi'; 

const AgentDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('inquiries');
    const [inquiries, setInquiries] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- Dummy Data Setup ---
        setLoading(false);
        setInquiries([
            { id: 1, user_email: 'user1@mail.com', property_title: '3 BHK Whitefield', message: 'Interested in a viewing.', status: 'New', property_id: 101 },
            { id: 2, user_email: 'user2@mail.com', property_title: '2 BHK Koramangala', message: 'What is the exact square footage?', status: 'Contacted', property_id: 102 },
        ]);
        setListings([
            { id: 101, location: 'Whitefield', bhk: 3, price: 85.0, area: 1800, status: 'Active' },
            { id: 102, location: 'Koramangala', bhk: 2, price: 45.5, area: 950, status: 'Active' },
        ]);
        // --- Real implementation: call API functions here ---
        // const loadData = async () => { ... }
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'listings':
                return <AgentListings listings={listings} />;
            case 'add':
                return <AddPropertyForm agentId={user.id} />;
            case 'analytics':
                return <AnalyticsView />;
            case 'inquiries':
            default:
                return <AgentInquiries inquiries={inquiries} />;
        }
    };

    if (loading) return <div className="text-center p-10">Loading Agent Dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto py-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello, Agent {user?.username}!</h1>
            <p className="text-xl text-gray-600 mb-8">Manage your properties and client interactions.</p>

            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                {['inquiries', 'listings', 'add', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 capitalize font-medium whitespace-nowrap transition ${
                            activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab === 'add' ? 'Add New Property' : tab}
                    </button>
                ))}
            </div>

            {renderContent()}
        </div>
    );
};

// Sub-component for Inquiries
const AgentInquiries = ({ inquiries }) => (
    <div className="space-y-4">
        <h3 className="text-2xl font-semibold mb-4">Incoming Inquiries ({inquiries.filter(i => i.status === 'New').length} New)</h3>
        {inquiries.length === 0 ? (
            <p className="text-gray-500 bg-white p-4 rounded-lg shadow">No inquiries received yet.</p>
        ) : (
            inquiries.map(i => (
                <div key={i.id} className={`bg-white p-4 rounded-lg shadow border-l-4 ${i.status === 'New' ? 'border-red-500' : 'border-green-500'}`}>
                    <p className="font-bold">{i.property_title}</p>
                    <p className="text-sm text-gray-600">From: {i.user_email} | Property ID: {i.property_id}</p>
                    <p className="mt-2 text-gray-800 italic border-l-2 pl-2">"{i.message}"</p>
                    <div className="mt-3 flex justify-end space-x-2">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${i.status === 'New' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {i.status}
                        </span>
                        <button className="text-xs text-blue-500 hover:underline">Mark as Contacted</button>
                    </div>
                </div>
            ))
        )}
    </div>
);

// Sub-component for Listings
const AgentListings = ({ listings }) => (
    <div>
        <h3 className="text-2xl font-semibold mb-4">Your Active Listings ({listings.length})</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {listings.map(p => (
                <div key={p.id} className="p-4 border-b flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                        <p className="font-bold">{p.bhk} BHK at {p.location}</p>
                        <p className="text-sm text-gray-500">{p.area} sqft</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-blue-600">₹{p.price} L</p>
                        <button className="text-xs text-indigo-500 hover:underline">Edit</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// Sub-component for Adding Property
const AddPropertyForm = ({ agentId }) => {
    const [form, setForm] = useState({ location: '', bhk: '', area: '', price: '', amenities: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // NOTE: In a real app, call the propertyApi.addProperty() here
        try {
             // await addProperty(form); 
             console.log("Submitting property:", { ...form, agent_id: agentId });
             setMessage('Property successfully listed!');
             setForm({ location: '', bhk: '', area: '', price: '', amenities: '' });
        } catch (error) {
            setMessage('Failed to add property.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold mb-6">List a New Property</h3>
            {message && <p className={`mb-4 p-2 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="location" type="text" placeholder="Location (e.g., Whitefield)" required value={form.location} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="bhk" type="number" placeholder="BHK" required value={form.bhk} onChange={handleChange} className="w-full p-2 border rounded" min="1" />
                <input name="area" type="number" placeholder="Area (Sq. Ft.)" required value={form.area} onChange={handleChange} className="w-full p-2 border rounded" min="300" />
                <input name="price" type="number" placeholder="Listing Price (Lakhs)" required value={form.price} onChange={handleChange} className="w-full p-2 border rounded" min="1" step="0.1" />
                <textarea name="amenities" placeholder="Amenities (Pool, Gym, Park...)" value={form.amenities} onChange={handleChange} className="w-full p-2 border rounded"></textarea>
                <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 transition">
                    {loading ? 'Submitting...' : 'Submit Property Listing'}
                </button>
            </form>
        </div>
    );
};

// Sub-component for Analytics (Placeholder)
const AnalyticsView = () => (
    <div className="bg-white p-8 rounded-lg shadow-xl border-l-4 border-yellow-500">
        <h3 className="text-2xl font-semibold mb-4">Market Analytics Overview 📈</h3>
        <p className="text-gray-600">
            This section would show real-time data like:
            <ul className="list-disc list-inside mt-2 ml-4 text-sm">
                <li>Total Inquiries received this month.</li>
                <li>Average listing price vs. Predicted Market Value in your areas.</li>
                <li>Performance metrics of your listings (views, saved properties).</li>
            </ul>
        </p>
        <p className="mt-4 text-sm text-gray-500">
            (Analytics feature requires dedicated backend routes and data aggregation.)
        </p>
    </div>
);


export default AgentDashboard;