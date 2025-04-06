import React from 'react';
import { Link } from '@inertiajs/react'

const LocationList = ({user, locations}) => {
   return (
      <>
         <h1>{user.email}'s Locations</h1>
        {locations.map(location => (
            <div key={location.id}>
               <Link href={`/locations/${location.id}`}>{location.name}</Link>
            </div>   
         ))}
      </>
   ) 
};

export default LocationList;