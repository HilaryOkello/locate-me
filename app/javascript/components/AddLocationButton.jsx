// src/components/AddLocationButton.jsx
import React from 'react';

/**
 * AddLocationButton Component
 *
 * A button designed to trigger location adding mode on the map.
 * Shows different states based on whether the user is currently in selection mode.
 *
 * @param {object} props - Component props
 * @param {function} props.onClick - Function to call when the button is clicked
 * @param {boolean} [props.isActive=false] - Whether the location selection mode is active
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.className=''] - Additional CSS classes
 */
const AddLocationButton = ({
    onClick,
    isActive = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const activeClass = isActive 
        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
        : 'bg-white text-indigo-600 hover:bg-indigo-50';

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`
                ${activeClass}
                w-10 h-10 rounded-full shadow-lg
                flex items-center justify-center
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300
                disabled:opacity-60 disabled:cursor-not-allowed
                ${className}
            `}
            title={isActive ? "Cancel adding location" : "Add a new location"}
            aria-label={isActive ? "Cancel adding location" : "Add a new location"}
            {...props}
        >
            {isActive ? (
                // X icon for cancel mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            ) : (
                // Plus icon for add mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            )}
        </button>
    );
};

export default AddLocationButton;