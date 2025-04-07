// src/components/LocationErrorToast.jsx
import React from 'react';

const LocationErrorToast = ({ message, onDismiss, className = '', ...props }) => {
    if (!message) return null;

    return (
        <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-3 z-[500] flex items-center text-sm pointer-events-auto max-w-sm ${className}`}
            role="alert"
            {...props}
        >
            <div className="mr-2 text-red-500 shrink-0"> {/* Added shrink-0 */}
                {/* Error Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <span className="flex-grow mr-2">{message || 'Unable to access your location.'}</span> {/* Added flex-grow */}
            <button
                onClick={onDismiss}
                className="ml-auto text-gray-500 hover:text-gray-700 shrink-0" // Added shrink-0 and ml-auto
                aria-label="Dismiss error message"
            >
                {/* Close Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    );
};

export default LocationErrorToast;