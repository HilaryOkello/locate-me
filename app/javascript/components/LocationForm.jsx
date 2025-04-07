import React, { useState } from 'react';

/**
 * LocationForm Component
 *
 * A form that appears when the user selects a location on the map.
 * Allows them to name the location before saving.
 *
 * @param {object} props - Component props
 * @param {object} props.position - The selected position {lat, lng}
 * @param {function} props.onSubmit - Function to call with form data on submit (should be an Inertia router.post call)
 * @param {function} props.onCancel - Function to call when canceling the form
 */
const LocationForm = ({ position, onSubmit, onCancel }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;

        setIsSubmitting(true);

        try {
            await onSubmit({
                name: name.trim(),
                latitude: position.lat,
                longitude: position.lng
            });
            setName(''); // Reset form on successful submission (Inertia handles re-render)
        } catch (error) {
            console.error('Error submitting location:', error);
            // Optionally handle form-specific error display here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="absolute left-1/2 bottom-6 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-sm w-full mx-4 cursor-auto pointer-events-auto">
            <div className="mb-3 text-center text-sm text-gray-500">
                Selected coordinates: {position.lat.toFixed(6)}°, {position.lng.toFixed(6)}°
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="location-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Location Name
                    </label>
                    <input
                        type="text"
                        id="location-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter a name for this location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                        autoFocus
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-70"
                        disabled={!name.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Location'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LocationForm;