import React, { useRef, useCallback, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import LeafletMap from '../components/LeafletMap';
import UserLocationButton from '../components/UserLocationButton';
import AddLocationButton from '../components/AddLocationButton';
import LocationErrorToast from '../components/LocationError';
import LocationForm from '../components/LocationForm';
import MapTooltip from '../components/MapTooltip';
import { useGeolocation } from '../hooks/useGeolocation';

const LocationList = ({ user, locations }) => {
    const { userLocation, locationError, isLoading, getUserLocation, clearError } = useGeolocation();
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const { success: globalSuccess, errors: globalErrors } = usePage().props;

    // Store map reference when it's ready
    const handleMapReady = useCallback((mapInstance) => {
        mapInstanceRef.current = mapInstance;
    }, []);

    const centerMapOnUserLocation = useCallback(() => {
        if (userLocation && mapInstanceRef.current) {
            mapInstanceRef.current.setView(
                [userLocation.latitude, userLocation.longitude],
                15,
                { animate: true, duration: 1 }
            );
        } else if (!isLoading) {
            getUserLocation();
        }
    }, [userLocation, isLoading, getUserLocation]);

    const toggleAddingLocation = useCallback(() => {
        setIsAddingLocation(prev => !prev);
        setSelectedPosition(null);
        setSubmitError(null);
    }, []);

    const handleLocationSelect = useCallback((position) => {
        setSelectedPosition(position);
        setIsAddingLocation(false);
    }, []);

    const cancelLocationSelection = useCallback(() => {
        setSelectedPosition(null);
        setIsAddingLocation(true);
    }, []);

    const submitLocation = useCallback(async (locationData) => {
        setIsSubmitting(true);
        setSubmitError(null);
    
        router.post('/locations', locationData, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsAddingLocation(false);
                setSelectedPosition(null);
                setIsSubmitting(false);
                setSubmitError(null);
                // The page will re-render with the updated locations prop
            },
            onError: (errors) => {
                console.error('Error adding location:', errors);
                setSubmitError(errors?.message || 'Failed to add location. Please try again.');
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    }, []);

    const clearSubmitError = useCallback(() => {
        setSubmitError(null);
    }, []);

    return (
        <div className="absolute inset-0">
            <LeafletMap
                ref={mapRef}
                locations={locations}
                user={user}
                userLocation={userLocation}
                isAddingLocation={isAddingLocation}
                onLocationSelect={handleLocationSelect}
                onMapReady={handleMapReady}
                key="main-map" // Stable key to prevent remounting
            />

            <div className="absolute inset-0 pointer-events-none z-[450]">
                {isAddingLocation && (
                    <MapTooltip
                        message="Click anywhere on the map to add a location"
                        show={isAddingLocation && !selectedPosition}
                    />
                )}

                {globalSuccess && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-[500] text-sm">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            {globalSuccess}
                        </div>
                    </div>
                )}

                {selectedPosition && (
                    <LocationForm
                        position={selectedPosition}
                        onSubmit={submitLocation}
                        onCancel={cancelLocationSelection}
                    />
                )}

                <LocationErrorToast
                    message={locationError || submitError || (globalErrors && Object.values(globalErrors).flat().join(', '))}
                    onDismiss={locationError ? clearError : clearSubmitError}
                />

                <div className="absolute bottom-6 left-6 pointer-events-auto flex space-x-3">
                    <UserLocationButton
                        onClick={centerMapOnUserLocation}
                        isLoading={isLoading}
                        disabled={
                            (!userLocation && !isLoading && !!locationError) ||
                            isAddingLocation
                        }
                    />

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