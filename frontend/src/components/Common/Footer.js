import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-bg-dark-secondary text-white mt-12 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm text-text-muted">
                    &copy; 2025 RealEstate AI. All rights reserved.
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Powered by Flask, React, and Machine Learning.
                </p>
            </div>
        </footer>
    );
};

export default Footer;