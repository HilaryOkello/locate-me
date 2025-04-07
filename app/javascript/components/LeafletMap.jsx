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


// --- Component Definition ---
const LeafletMap = forwardRef(({
    locations,
    user,
    userLocation,
    initialCenter = [0.0236, 37.9062], // Kenya center
    initialZoom = 6,
    onMapReady
}, ref) => {
    // --- Hooks --- (Must be called inside the component body)
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userMarkerRef = useRef(null);
    const mapOverlayRef = useRef(null);

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
            `;
            document.head.appendChild(style);

            // Optional Cleanup: If this is the ONLY component needing this style,
            // you might want to remove it on unmount. Often, global styles like
            // animations are fine to leave.
            // return () => {
            //     const styleElement = document.getElementById(styleId);
            //     if (styleElement) {
            //         console.log('Removing pulse animation style');
            //         document.head.removeChild(styleElement);
            //     }
            // };
        }
    }, []); // Empty dependency array ensures this runs only once on mount

    // Expose map instance methods via ref
    useImperativeHandle(ref, () => ({
        setView: (center, zoom, options) => {
            mapInstanceRef.current?.setView(center, zoom, options);
        },
        getMapInstance: () => mapInstanceRef.current,
    }));

    // Effect for map initialization and location markers
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: initialCenter,
            zoom: initialZoom,
            zoomControl: false // Add custom styled one later
        });
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        // Add and style zoom controls
        const zoomControl = L.control.zoom({ position: 'bottomright' }).addTo(map);
        styleZoomControls(mapContainerRef.current); // Style after adding

        // Add location markers (using custom indigo dot icon)
        const locationIcon = L.divIcon({
            className: 'custom-div-icon', // Can target this with CSS if needed
            html: `<div style="background-color: #4f46e5; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [16, 16], // Size of the clickable area
            iconAnchor: [8, 8] // Center the icon anchor
        });

        locations.forEach(location => {
            const tooltipContent = `<div class="p-2">
                <div class="font-bold text-indigo-700">${location.name}</div>
                <div class="text-gray-600">Added by: ${user?.email || 'Unknown'}</div>
              </div>`;
            L.marker([location.latitude, location.longitude], { icon: locationIcon })
                .addTo(map)
                .bindTooltip(tooltipContent, {
                    direction: 'top',
                    permanent: false,
                    className: 'bg-white shadow-lg rounded-lg border-none font-sans' // Add font-sans if needed
                });
        });

        // Handle Map Overlay positioning
        const overlayElement = mapOverlayRef.current;
        if (overlayElement) {
            const updateOverlay = () => {
                 if (!map.getBounds().isValid() || !overlayElement) return;
                try {
                    const mapBounds = map.getBounds();
                    const southWest = mapBounds.getSouthWest();
                    const northEast = mapBounds.getNorthEast();
                    const bottomLeft = map.latLngToLayerPoint(southWest);
                    const topRight = map.latLngToLayerPoint(northEast);

                    L.DomUtil.setPosition(overlayElement, bottomLeft);
                    overlayElement.style.width = `${Math.abs(topRight.x - bottomLeft.x)}px`;
                    overlayElement.style.height = `${Math.abs(bottomLeft.y - topRight.y)}px`;
                } catch (e) {
                    // This can happen briefly during map destruction or initialization
                    console.warn("Could not update overlay position:", e);
                }
            };
            map.on('move zoom viewreset load', updateOverlay); // Update on various map events
            map.whenReady(updateOverlay); // Ensure initial position
            setTimeout(updateOverlay, 50); // Extra check for race conditions
        }

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
            // resizeObserver.disconnect(); // Alternative: disconnects observer entirely
        };
    }, [locations, user, initialCenter, initialZoom, onMapReady]); // Dependencies for map setup

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

    // --- Render ---
    return (
        <div ref={mapContainerRef} className="w-full h-full relative overflow-hidden"> {/* Added overflow-hidden */}
            {/* Color overlay with transparency */}
            <div
                ref={mapOverlayRef}
                className="absolute top-0 left-0 pointer-events-none z-[399]" // Below markers/controls
                style={{
                    backgroundColor: 'rgba(79, 70, 229, 0.08)',
                    mixBlendMode: 'multiply'
                }}
            ></div>
             {/* Map controls (like zoom) will be added by Leaflet into this container */}
        </div>
    );
});

export default LeafletMap;