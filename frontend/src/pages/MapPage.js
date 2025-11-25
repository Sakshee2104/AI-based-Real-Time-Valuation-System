import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import PageTransition from '../components/Common/PageTransition';
import 'leaflet/dist/leaflet.css'; // <-- CRITICAL: Import Leaflet's CSS

// --- FIX for broken Leaflet icons in Webpack ---
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41] // Point of the icon's tip
});
L.Marker.prototype.options.icon = DefaultIcon;
// --- END FIX ---


// --- Simulated Geocoded Data (From your Bengaluru Dataset) ---
const locations = [
    { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
    { name: 'Koramangala', lat: 12.9351, lng: 77.6244 },
    { name: 'Sarjapur', lat: 12.9121, lng: 77.7800 },
    { name: 'Hebbal', lat: 13.0355, lng: 77.5971 },
    { name: 'Electronic City', lat: 12.8452, lng: 77.6602 },
    { name: 'HSR Layout', lat: 12.9121, lng: 77.6446 },
    { name: 'Yelahanka', lat: 13.1006, lng: 77.5963 },
    { name: 'Marathahalli', lat: 12.9591, lng: 77.7013 }
];

// Center of Bengaluru
const center = [12.9716, 77.5946];

const MapPage = () => {
    // No API key or loader needed!

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto py-10 px-4 text-text-light pt-28">
                <h1 className="text-4xl font-extrabold text-brand-primary mb-6">Bengaluru Location Map</h1>
                <p className="text-text-muted mb-8">
                    This map shows the primary locations from our ML prediction dataset. (Powered by OpenStreetMap)
                </p>

                <div className="bg-bg-dark-card p-6 rounded-xl shadow-2xl">
                    <MapContainer 
                        center={center} 
                        zoom={11} 
                        style={{ height: '70vh', width: '100%', borderRadius: '1rem' }}
                    >
                        {/* This TileLayer uses OpenStreetMap - 100% Free */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        
                        {/* Add markers for all locations */}
                        {locations.map(loc => (
                            <Marker
                                key={loc.name}
                                position={[loc.lat, loc.lng]}
                            >
                                <Popup>
                                    {/* Popup text must be dark to be visible on white background */}
                                    <strong style={{color: 'black'}}>{loc.name}</strong>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </PageTransition>
    );
};

export default MapPage;