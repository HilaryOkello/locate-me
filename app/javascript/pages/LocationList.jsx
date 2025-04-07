import React, { useRef, useCallback } from 'react';
import { Link } from '@inertiajs/react'; // Keep if needed elsewhere in Layout or page
import Layout from '../components/Layout';
import LeafletMap from '../components/LeafletMap';
import UserLocationButton from '../components/UserLocationButton';
import LocationErrorToast from '../components/LocationError';
import { useGeolocation } from '../hooks/useGeolocation';

const LocationList = ({ user, locations }) => {
    // Use the custom hook for geolocation state and logic
    const { userLocation, locationError, isLoading, getUserLocation, clearError } = useGeolocation();
    const mapRef = useRef(null); // Ref to access LeafletMap imperative methods

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

    // Attempt to get location on initial load (optional, button click can also trigger)
    // useEffect(() => {
    //    getUserLocation();
    // }, [getUserLocation]);


    return (
        <Layout user={user}> {/* Pass user to Layout if needed there */}
            <div className="absolute inset-0">
                {/* Pass relevant props to LeafletMap */}
                <LeafletMap
                    ref={mapRef} // Assign ref to access map methods
                    locations={locations}
                    user={user}
                    userLocation={userLocation} // Pass userLocation state down
                    // Optional: Add onMapReady if needed: onMapReady={(map) => console.log('Map is ready!')}
                />

                {/* Container for floating UI elements over the map */}
                <div className="absolute inset-0 pointer-events-none z-[450]"> {/* Ensure this container is above map overlay */}
                    {/* User Location Button */}
                    <div className="absolute bottom-6 left-6 pointer-events-auto">
                        <UserLocationButton
                            onClick={centerMapOnUserLocation}
                            isLoading={isLoading}
                            disabled={!userLocation && !isLoading && !!locationError} // Disable if error shown and no location
                        />
                    </div>

                    {/* Location Error Toast */}
                    <LocationErrorToast
                        message={locationError}
                        onDismiss={clearError} // Use clearError from the hook
                    />
                </div>
            </div>
        </Layout>
    );
};

export default LocationList;