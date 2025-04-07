import { useState, useCallback } from 'react';

export function useGeolocation(options = { enableHighAccuracy: true }) {
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getUserLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by this browser.");
            return;
        }

        setIsLoading(true);
        setLocationError(null); // Clear previous errors

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setIsLoading(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                setLocationError(error.message);
                setUserLocation(null); // Clear location on error
                setIsLoading(false);
            },
            options
        );
    }, [options]);

    const clearError = useCallback(() => {
        setLocationError(null);
    }, []);

    return {
        userLocation,
        locationError,
        isLoading,
        getUserLocation,
        clearError,
    };
}