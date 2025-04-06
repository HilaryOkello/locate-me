import React from 'react';

const Location = ({location}) => {
    return (
        <>
            <h1>{location.name}</h1>
            <div>Latitude: {location.latitude}</div>
            <div>Longitude: {location.longitude}</div>
        </>
    );
}

export default Location;