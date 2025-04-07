// src/components/MapTooltip.jsx
import React from 'react';

/**
 * MapTooltip Component
 *
 * A floating tooltip that provides guidance to users during map interactions.
 *
 * @param {object} props - Component props
 * @param {string} props.message - The message to display
 * @param {boolean} [props.show=true] - Whether to show the tooltip
 */
const MapTooltip = ({ message, show = true }) => {
    if (!show || !message) return null;

    return (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg z-[500] text-sm font-medium">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                {message}
            </div>
        </div>
    );
};

export default MapTooltip;