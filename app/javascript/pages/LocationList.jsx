import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icon issue (shadow.png not found)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationList = ({ user, locations }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
            center: [0.0236, 37.9062], // Approximate center of Kenya
            zoom: 3,
            zoomControl: false // Disable default zoom controls
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        locations.forEach(location => {
            const tooltipContent = `<b>${location.name}</b><br>Added by: ${user.email}`;
            L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindTooltip(tooltipContent);
        });

        // Custom zoom control
        const zoomControl = L.control.zoom({
            position: 'topright' // We'll adjust the position with CSS
        });
        zoomControl.addTo(map);

        // Apply custom styling for the zoom control
        const zoomInButton = mapRef.current.querySelector('.leaflet-control-zoom-in');
        const zoomOutButton = mapRef.current.querySelector('.leaflet-control-zoom-out');

        if (zoomInButton && zoomOutButton) {
            const zoomControlContainer = zoomInButton.parentNode;
            zoomControlContainer.classList.add('flex', 'flex-col', 'absolute', 'right-4', 'top-1/2', '-translate-y-1/2', 'z-10');
            zoomInButton.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300', 'rounded-t', 'py-2', 'px-3', 'shadow-md', 'hover:bg-gray-100', 'focus:outline-none');
            zoomOutButton.classList.add('bg-white', 'text-gray-700', 'border', 'border-gray-300', 'rounded-b', 'py-2', 'px-3', 'shadow-md', 'hover:bg-gray-100', 'focus:outline-none');
        }

        return () => {
            map.remove(); // Clean up the map on unmount
        };
    }, [locations]);

    return (
        <>
            <Layout>
                <div ref={mapRef} className="absolute top-0 left-0 w-full h-full" style={{ marginTop: '60px', marginBottom: '56px' }}>
                    {/* The map will be rendered here */}
                </div>
            </Layout>
        </>
    );
};

export default LocationList;