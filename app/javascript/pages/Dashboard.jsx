import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { TrashIcon} from '@heroicons/react/24/outline';

const Dashboard = ({ locations: initialLocations, totalLocations, totalUsers }) => {
  const [locations, setLocations] = useState(initialLocations);
  const [deletedLocationName, setDeletedLocationName] = useState(null);
  const { delete: destroy, processing, error, reset } = useForm({});
  const { delete: destroyAll, processing: processingAll, error: errorAll, reset: resetAll } = useForm({});

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      destroy(`/dashboard/locations/${id}`, {
        onSuccess: () => {
          setLocations(locations.filter((location) => location.id !== id));
          setDeletedLocationName(name);
          setTimeout(() => setDeletedLocationName(null), 3000); // Clear message after 3 seconds
        },
      });
    }
  };

  const handleDeleteAll = () => {
    if (confirm('Are you sure you want to delete ALL locations? This action cannot be undone.')) {
      destroyAll('/dashboard/locations', { // Assuming you'll create this route
        onSuccess: () => {
          setLocations([]);
          setDeletedLocationName('all locations');
          setTimeout(() => setDeletedLocationName(null), 3000); // Clear message after 3 seconds
        },
      });
    }
  };

  return (
    <>
      <Head title="Admin Dashboard" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <div className="p-6 bg-white border-b border-gray-200 flex flex-col"> {/* Removed h-full here if it was causing layout issues */}
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-medium text-gray-700">All Locations</h2>
                </div>
                <div>
                  <button
                    onClick={handleDeleteAll}
                    className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${processingAll || locations.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={processingAll || locations.length === 0}
                    title="Delete All Locations"
                  >
                    <TrashIcon className="h-5 w-5 inline-block mr-1" /> Delete All
                  </button>
                  {errorAll && <div className="text-red-500 text-sm mt-1">{errorAll}</div>}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600">
                  Total Locations: <span className="font-semibold">{totalLocations}</span>
                </p>
                <p className="text-gray-600">
                  Total Users: <span className="font-semibold">{totalUsers}</span>
                </p>
              </div>

              {deletedLocationName && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Success!</strong>
                  <span className="block sm:inline"> Location{deletedLocationName === 'all locations' ? 's' : ''} "{deletedLocationName}" successfully deleted.</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg onClick={() => setDeletedLocationName(null)} className="fill-current h-6 w-6 text-green-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.546 6.354 14.849a1.2 1.2 0 0 1-1.697-1.697L8.303 10 4.651 6.354a1.2 1.2 0 0 1 1.697-1.697L10 8.454 13.646 4.801a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.651 3.303a1.2 1.2 0 0 1 0 1.697z" clipRule="evenodd"/></svg>
                  </span>
                </div>
              )}

              <div className="overflow-x-auto max-h-96 overflow-y-auto"> {/* Added max-h and overflow-y */}
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Latitude</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Longitude</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">User</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Created At</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {locations.map((location) => (
                      <tr key={location.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-800">{location.name}</td>
                        <td className="py-4 px-4 text-gray-800">{location.latitude}</td>
                        <td className="py-4 px-4 text-gray-800">{location.longitude}</td>
                        <td className="py-4 px-4 text-gray-800">{location.user.name}</td>
                        <td className="py-4 px-4 text-gray-800">
                          {new Date(location.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleDelete(location.id, location.name)}
                            className={`text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Delete Location"
                            disabled={processing}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                        </td>
                      </tr>
                    ))}

                    {locations.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                          No locations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;