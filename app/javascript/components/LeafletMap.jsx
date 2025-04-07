// src/components/LeafletMap.jsx
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icon fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;

// Utility function for styling zoom controls (remains outside component is fine)
const styleZoomControls = (mapElement) => {
    if (!mapElement) return;
    setTimeout(() => {
        const zoomInButton = mapElement.querySelector('.leaflet-control-zoom-in');
        const zoomOutButton = mapElement.querySelector('.leaflet-control-zoom-out');
        const indigoColor = '#4f46e5'; // Tailwind's indigo-600

        const applyStyles = (button) => {
            if (button) {
                // Use Tailwind classes where possible, supplement with inline styles for overrides
                button.classList.add(
                    'bg-white',
                    'hover:bg-indigo-50',
                    'transition-colors',
                    'duration-200'
                );
                // Force color override if needed
                button.style.color = indigoColor;
                button.style.border = 'none'; // Remove default Leaflet border
                button.style.textDecoration = 'none';
            }
        };

        applyStyles(zoomInButton);
        applyStyles(zoomOutButton);
        if (zoomOutButton) {
           // Remove potentially conflicting border class if it exists
           zoomOutButton.classList.remove('border-t', 'border-gray-200');
        }
    }, 100); // Delay might be needed for Leaflet to render controls
};

const LeafletMap = forwardRef(({
    locations,
    user,
    userLocation,
    initialCenter = [-0.0917, 34.7680],
    initialZoom = 10,
    onMapReady,
    isAddingLocation = false,
    onLocationSelect
}, ref) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userMarkerRef = useRef(null);
    const tempMarkerRef = useRef(null);
    const clickHandlerRef = useRef(null);
    const markersRef = useRef([]); // Store location markers for cleanup
    const locationsRef = useRef(locations); // Store locations for comparison

    // Effect to add global CSS animation styles ONCE when the component mounts
    useEffect(() => {
        const styleId = 'leaflet-pulse-animation';
        // Check if the style tag already exists to avoid duplicates
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
                }
                /* Base style for the user icon container (needed for positioning context) */
                .user-location-icon {
                    position: relative; /* Ensures child absolute positioning works relative to this */
                    width: 32px; /* Match iconSize */
                    height: 32px; /* Match iconSize */
                }
                /* Style for the selection marker */
                .selection-marker-icon {
                    position: relative;
                    width: 32px;
                    height: 32px;
                }
            `;
            document.head.appendChild(style);
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Expose map instance methods via ref
    useImperativeHandle(ref, () => ({
        setView: (center, zoom, options) => {
            mapInstanceRef.current?.setView(center, zoom, options);
        },
        getMapInstance: () => mapInstanceRef.current,
    }));

    // Effect for map initialization - ONLY once
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: initialCenter,
            zoom: initialZoom,
            zoomControl: false // Add custom styled one later
        });
        mapInstanceRef.current = map;

        L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.{ext}', {
            subdomains: 'abcd',
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'png'
        }).addTo(map);

        // Add and style zoom controls
        const zoomControl = L.control.zoom({ position: 'bottomright' }).addTo(map);
        styleZoomControls(mapContainerRef.current); // Style after adding

        // Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize({ animate: false }); // Invalidate size without animation on resize
        });
        if (mapContainerRef.current) {
           resizeObserver.observe(mapContainerRef.current);
        }

        if (onMapReady) {
            map.whenReady(() => onMapReady(map)); // Ensure map is fully ready
        }

        // Cleanup
        return () => {
            map.remove();
            mapInstanceRef.current = null;
            if (mapContainerRef.current) {
               resizeObserver.unobserve(mapContainerRef.current); // Use unobserve for specific element
            }
        };
    }, []); // Empty dependency - initialize map ONCE

    // Separate effect to update map with locations
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clean up previous markers
        markersRef.current.forEach(marker => {
            try { 
                marker.remove();
            } catch(e) {
                // Ignore errors if marker already removed
            }
        });
        markersRef.current = [];

        // Create location icon
        const locationIcon = L.divIcon({
            className: 'custom-div-icon', 
            html: `<div style="background-color: #4f46e5; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16], 
            iconAnchor: [8, 8] 
        });

        // Add location markers
        locations.forEach(location => {
            const tooltipContent = `<div class="p-2">
                <div class="font-bold text-indigo-700">${location.name}</div>
                <div class="text-gray-600">Added by: ${user?.email || 'Unknown'}</div>
              </div>`;
            const marker = L.marker([location.latitude, location.longitude], { icon: locationIcon })
                .addTo(map)
                .bindTooltip(tooltipContent, {
                    direction: 'top',
                    permanent: false,
                    className: 'bg-white shadow-lg rounded-lg border-none font-sans'
                });
            markersRef.current.push(marker);
        });

        locationsRef.current = locations;
    }, [locations, user]); // Only when locations change

    // Effect to handle adding/updating the USER marker when userLocation prop changes
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return; // Don't proceed if map isn't initialized

        // Remove previous marker if userLocation is gone or marker exists
        if (!userLocation && userMarkerRef.current) {
             try { map.removeLayer(userMarkerRef.current); } catch(e) {/* Ignore */}
             userMarkerRef.current = null;
             return; // Exit early
        }

        if (userLocation) {
            const { latitude, longitude } = userLocation;
            const userLocationIcon = L.divIcon({
                className: 'user-location-icon', // Class for styling & targeting
                html: `
                    <div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6, 0 1px 6px rgba(0,0,0,0.4); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; width: 32px; height: 32px; border-radius: 50%; background-color: rgba(59, 130, 246, 0.2); transform: translate(-50%, -50%); animation: pulse 1.5s infinite ease-out; z-index: 1;"></div>
                `, // Adjusted pulse animation timing
                iconSize: [32, 32],   // Overall clickable size
                iconAnchor: [16, 16] // Anchor at the center of the icon
            });

            if (userMarkerRef.current) {
                userMarkerRef.current.setLatLng([latitude, longitude]);
            } else {
                userMarkerRef.current = L.marker([latitude, longitude], { icon: userLocationIcon, zIndexOffset: 1000 }) // High z-index
                    .addTo(map)
                    .bindTooltip('Your Location', {
                        permanent: false,
                        direction: 'top',
                        className: 'bg-white shadow-lg rounded-lg border-none font-sans'
                    });
            }
        }
    }, [userLocation]); // Re-run only when userLocation changes

    // Effect to handle "Add Location" mode
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clean up any existing markers and handlers
        if (tempMarkerRef.current) {
            map.removeLayer(tempMarkerRef.current);
            tempMarkerRef.current = null;
        }

        if (clickHandlerRef.current) {
            map.off('click', clickHandlerRef.current);
            clickHandlerRef.current = null;
        }

        // Set cursor style based on mode
        if (mapContainerRef.current) {
            if (isAddingLocation) {
                mapContainerRef.current.style.cursor = 'crosshair';
            } else {
                mapContainerRef.current.style.cursor = '';
            }
        }

        // If we're in adding mode, set up the click handler
        if (isAddingLocation) {
            const selectionIcon = L.divIcon({
                className: 'selection-marker-icon',
                html: `
                    <div style="background-color: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #10b981, 0 1px 6px rgba(0,0,0,0.4); position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2;"></div>
                    <div style="position: absolute; top: 50%; left: 50%; width: 32px; height: 32px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.2); transform: translate(-50%, -50%); animation: pulse 1.5s infinite ease-out; z-index: 1;"></div>
                `,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
            });

            clickHandlerRef.current = (e) => {
                const { lat, lng } = e.latlng;
                
                // Remove previous temp marker if exists
                if (tempMarkerRef.current) {
                    map.removeLayer(tempMarkerRef.current);
                }
                
                // Add new marker at clicked position
                tempMarkerRef.current = L.marker([lat, lng], { icon: selectionIcon, zIndexOffset: 1001 })
                    .addTo(map);
                
                // Call the parent handler
                if (onLocationSelect) {
                    onLocationSelect({ lat, lng });
                }
            };
            
            map.on('click', clickHandlerRef.current);
        }

        return () => {
            // Clean up on unmount or dependency change
            if (map && clickHandlerRef.current) {
                map.off('click', clickHandlerRef.current);
            }
            
            // Reset cursor
            if (mapContainerRef.current) {
                mapContainerRef.current.style.cursor = '';
            }
        };
    }, [isAddingLocation, onLocationSelect]);

    return (
        <div ref={mapContainerRef} className="w-full h-full relative overflow-hidden">
            {/* Map controls (like zoom) will be added by Leaflet into this container */}
        </div>
    );
});

export default LeafletMap;