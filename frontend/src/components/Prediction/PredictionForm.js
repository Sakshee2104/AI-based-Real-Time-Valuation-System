import React, { useState } from 'react';

// Sample data - Top locations for Bengaluru
const LOCATIONS = [
    "Whitefield", "Koramangala", "HSR Layout", "Electronic City", 
    "Marathahalli", "Yelahanka", "Sarjapur", "Hebbal", "Other"
];

const PredictionForm = ({ onSubmit, isLoading }) => {
    const [form, setForm] = useState({
        location: LOCATIONS[0],
        bhk: 2,
        area: 1200, // Sqft
        amenities: 'Gym, Pool'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert strings to correct types before sending to API
        onSubmit({
            ...form,
            bhk: parseInt(form.bhk),
            area: parseFloat(form.area)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-xl mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Location */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Location</span>
                    <select
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 h-10"
                    >
                        {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </label>
                
                {/* BHK */}
                <label className="block">
                    <span className="text-gray-700 font-medium">BHK (Bedrooms)</span>
                    <input
                        type="number"
                        name="bhk"
                        value={form.bhk}
                        onChange={handleChange}
                        min="1"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10"
                    />
                </label>

                {/* Area */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Area (Sq. Ft.)</span>
                    <input
                        type="number"
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        min="300"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10"
                    />
                </label>

                {/* Amenities */}
                <label className="block">
                    <span className="text-gray-700 font-medium">Key Amenities (Optional)</span>
                    <input
                        type="text"
                        name="amenities"
                        value={form.amenities}
                        onChange={handleChange}
                        placeholder="e.g., Gym, Pool, Park"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-10"
                    />
                </label>
            </div>

            <div className="mt-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:bg-blue-400"
                >
                    {isLoading ? 'Calculating Price & CMA...' : 'Get Price Prediction & CMA'}
                </button>
            </div>
        </form>
    );
};

export default PredictionForm;