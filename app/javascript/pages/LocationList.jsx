import React, { useRef, useCallback, useState } from 'react';
import { Link } from '@inertiajs/react'; // Keep if needed elsewhere in Layout or page
import LeafletMap from '../components/LeafletMap';
import UserLocationButton from '../components/UserLocationButton';
import AddLocationButton from '../components/AddLocationButton';
import LocationErrorToast from '../components/LocationError';
import LocationForm from '../components/LocationForm';
import MapTooltip from '../components/MapTooltip';
import { useGeolocation } from '../hooks/useGeolocation';
import axios from 'axios'; // You'll need axios for the API requests

const LocationList = ({ user, locations }) => {
    // Use the custom hook for geolocation state and logic
    const { userLocation, locationError, isLoading, getUserLocation, clearError } = useGeolocation();
    const mapRef = useRef(null); // Ref to access LeafletMap imperative methods
    
    // New state for location adding functionality
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Function to center map, now calls the map component's method
    const centerMapOnUserLocation = useCallback(() => {
        if (userLocation && mapRef.current) {
            mapRef.current.setView(
                [userLocation.latitude, userLocation.longitude],
                15, // Zoom level
                { animate: true, duration: 1 }
            );
        } else if (!isLoading) {
             // If no location yet and not already loading, try fetching it
            getUserLocation();
        }
    }, [userLocation, isLoading, getUserLocation]);

    // Toggle location adding mode
    const toggleAddingLocation = useCallback(() => {
        setIsAddingLocation(prev => !prev);
        setSelectedPosition(null);
        setSubmitError(null);
    }, []);

    const handleLocationSelect = useCallback((position) => {
        setSelectedPosition(position);
        setIsAddingLocation(false); // Temporarily disable adding mode while form is open
    }, []);

    // Cancel location selection
    const cancelLocationSelection = useCallback(() => {
        setSelectedPosition(null);
        setIsAddingLocation(true); // Re-enable adding mode if they cancel
    }, []);

    // Handle location form submission
    const submitLocation = useCallback(async (locationData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            // Assuming you have a route set up for adding locations
            const response = await axios.post('/api/locations', locationData);
            
            // Show success message
            setSuccessMessage('Location added successfully!');
            
            // Reset the UI state
            setIsAddingLocation(false);
            setSelectedPosition(null);
            
            // Clear success message after a delay
            setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            
            // You might want to refresh locations or add to client-side state
            // depending on your app architecture
            window.location.reload(); // Simple approach - reload the page
            
            return response.data;
        } catch (error) {
            console.error('Error adding location:', error);
            setSubmitError(error.response?.data?.message || 'Failed to add location. Please try again.');
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // Handle temporary errors
    const clearSubmitError = useCallback(() => {
        setSubmitError(null);
    }, []);

    return (
            <div className="absolute inset-0">
                {/* Pass relevant props to LeafletMap */}
                <LeafletMap
                    ref={mapRef} // Assign ref to access map methods
                    locations={locations}
                    user={user}
                    userLocation={userLocation} // Pass userLocation state down
                    isAddingLocation={isAddingLocation} // Pass the new state
                    onLocationSelect={handleLocationSelect} // Pass the handler
                />

                {/* Container for floating UI elements over the map */}
                <div className="absolute inset-0 pointer-events-none z-[450]"> {/* Ensure this container is above map overlay */}
                    {/* Map Tooltip for guidance */}
                    {isAddingLocation && (
                        <MapTooltip
                            message="Click anywhere on the map to add a location"
                            show={isAddingLocation && !selectedPosition}
                        />
                    )}
                    
                    {/* Success Message Toast */}
                    {successMessage && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[500] text-sm">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                {successMessage}
                            </div>
                        </div>
                    )}

                    {/* Location Form (shows when position is selected) */}
                    {selectedPosition && (
                        <LocationForm
                            position={selectedPosition}
                            onSubmit={submitLocation}
                            onCancel={cancelLocationSelection}
                        />
                    )}

                    {/* Location Error Toast */}
                    <LocationErrorToast
                        message={locationError || submitError}
                        onDismiss={locationError ? clearError : clearSubmitError}
                    />
                    
                    {/* Button Container */}
                    <div className="absolute bottom-6 left-6 pointer-events-auto flex space-x-3">
                        {/* User Location Button */}
                        <UserLocationButton
                            onClick={centerMapOnUserLocation}
                            isLoading={isLoading}
                            disabled={
                                (!userLocation && !isLoading && !!locationError) || 
                                isAddingLocation // Also disable when adding location
                            }
                        />
                        
                        {/* Add Location Button */}
                        <AddLocationButton
                            onClick={toggleAddingLocation}
                            isActive={isAddingLocation}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </div>
    );
};

export default LocationList;