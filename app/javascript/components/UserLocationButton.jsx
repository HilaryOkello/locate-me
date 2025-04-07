// src/components/UserLocationButton.jsx
import React from 'react';

/**
 * UserLocationButton Component
 *
 * A button specifically designed to trigger an action related to the user's geolocation,
 * typically centering a map. It shows a loading spinner when the action is in progress.
 *
 * @param {object} props - Component props
 * @param {function} props.onClick - Function to call when the button is clicked.
 * @param {boolean} [props.disabled=false] - Whether the button is explicitly disabled (besides loading state).
 * @param {boolean} [props.isLoading=false] - If true, displays a loading spinner instead of the icon and disables the button.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the button element.
 * @param {string} [props.title='Go to my location'] - Tooltip text for the button.
 */
const UserLocationButton = ({
    onClick,
    disabled = false,
    isLoading = false,
    className = '',
    title = 'Go to my location', // Default title
    ...props // Pass down any other standard button attributes (e.g., aria-label)
}) => {
    // The button is effectively disabled if the passed 'disabled' prop is true OR if it's loading
    const isDisabled = disabled || isLoading;

    return (
        <button
            type="button" // Explicitly set type="button" to prevent accidental form submissions
            onClick={onClick}
            disabled={isDisabled}
            className={`
                bg-white hover:bg-indigo-50 text-indigo-600
                w-10 h-10 rounded-full shadow-lg
                flex items-center justify-center
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-300
                disabled:opacity-60 disabled:cursor-not-allowed
                ${isLoading ? 'animate-pulse' : ''} // Optional: subtle pulse when loading
                ${className}
            `}
            title={title}
            aria-label={title} // Good practice for accessibility
            {...props}
        >
            {isLoading ? (
                // Loading Spinner SVG
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                // Original Location Icon SVG (Concentric Circles)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            )}
        </button>
    );
};

export default UserLocationButton;