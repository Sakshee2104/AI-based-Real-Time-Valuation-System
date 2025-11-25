import React, { useState } from 'react';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties }) => {
    const [sortKey, setSortKey] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    // Simple sorting function
    const sortedProperties = [...properties].sort((a, b) => {
        let aValue = a[sortKey];
        let bValue = b[sortKey];

        // Handle string comparison (for location)
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        let comparison = 0;
        if (aValue > bValue) comparison = 1;
        else if (aValue < bValue) comparison = -1;

        return sortOrder === 'asc' ? comparison : comparison * -1;
    });

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const SortButton = ({ keyName, label }) => (
        <button onClick={() => handleSort(keyName)} className="text-left hover:text-blue-600 transition">
            {label} {sortKey === keyName && (sortOrder === 'asc' ? '▲' : '▼')}
        </button>
    );

    if (sortedProperties.length === 0) {
        return <p className="text-center text-gray-500 p-8 bg-white rounded-lg shadow">No similar properties found for CMA.</p>;
    }

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Sorting Header */}
            <div className="p-4 border-b bg-gray-50 text-sm font-semibold text-gray-600 grid grid-cols-5 gap-4">
                <span className="col-span-2 sm:col-span-1 text-left"><SortButton keyName="price" label="Price (Lakhs)" /></span>
                <span className="col-span-1 text-left"><SortButton keyName="location" label="Location" /></span>
                <span className="col-span-1 hidden sm:block">Agent</span>
                <span className="col-span-2 sm:col-span-1 text-right">Action</span>
            </div>

            {/* Property Cards */}
            <div className="divide-y divide-gray-200">
                {sortedProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                ))}
            </div>
        </div>
    );
};

export default PropertyList;