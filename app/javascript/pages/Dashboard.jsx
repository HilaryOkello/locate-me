import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { TrashIcon } from '@heroicons/react/24/outline';

const Dashboard = ({ 
  locations: initialLocations, 
  users: initialUsers, 
  totalLocations, 
  totalUsers,
  currentUserId 
}) => {
  const [locations, setLocations] = useState(initialLocations);
  const [users, setUsers] = useState(initialUsers);
  const [deletedLocationName, setDeletedLocationName] = useState(null);
  const [deletedUserName, setDeletedUserName] = useState(null);
  const [activeTab, setActiveTab] = useState('locations'); // 'locations' or 'users'

  // Location forms
  const { 
    delete: destroyLocation, 
    processing: processingLocation, 
    error: errorLocation
  } = useForm({});
  
  const { 
    delete: destroyAllLocations, 
    processing: processingAllLocations, 
    error: errorAllLocations
  } = useForm({});

  // User forms
  const { 
    delete: destroyUser, 
    processing: processingUser, 
    error: errorUser
  } = useForm({});
  
  const { 
    delete: destroyAllUsers, 
    processing: processingAllUsers, 
    error: errorAllUsers
  } = useForm({});

  // Location handlers
  const handleDeleteLocation = (id, name) => {
    if (confirm(`Are you sure you want to delete location "${name}"?`)) {
      destroyLocation(`/dashboard/locations/${id}`, {
        onSuccess: () => {
          setLocations(locations.filter((location) => location.id !== id));
          setDeletedLocationName(name);
          setTimeout(() => setDeletedLocationName(null), 3000);
        },
      });
    }
  };

  const handleDeleteAllLocations = () => {
    if (confirm('Are you sure you want to delete ALL locations? This action cannot be undone.')) {
      destroyAllLocations('/dashboard/locations', {
        onSuccess: () => {
          setLocations([]);
          setDeletedLocationName('all locations');
          setTimeout(() => setDeletedLocationName(null), 3000);
        },
      });
    }
  };

  // User handlers
  const handleDeleteUser = (id, name) => {
    // Prevent deleting current user
    if (id === currentUserId) {
      alert("You cannot delete your own account");
      return;
    }
    
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      destroyUser(`/dashboard/users/${id}`, {
        onSuccess: () => {
          setUsers(users.filter((user) => user.id !== id));
          setDeletedUserName(name);
          setTimeout(() => setDeletedUserName(null), 3000);
        },
      });
    }
  };

  const handleDeleteAllUsers = () => {
    if (confirm('Are you sure you want to delete ALL users except yourself? This action cannot be undone.')) {
      destroyAllUsers('/dashboard/users', {
        onSuccess: () => {
          setUsers(users.filter(user => user.id === currentUserId));
          setDeletedUserName('all users except your account');
          setTimeout(() => setDeletedUserName(null), 3000);
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
            <div className="p-6 bg-white border-b border-gray-200 flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>

              <div className="mb-4">
                <p className="text-gray-600">
                  Total Locations: <span className="font-semibold">{totalLocations}</span>
                </p>
                <p className="text-gray-600">
                  Total Users: <span className="font-semibold">{totalUsers}</span>
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  className={`py-2 px-4 ${activeTab === 'locations' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                  onClick={() => setActiveTab('locations')}
                >
                  Locations
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
              </div>

              {/* Success messages */}
              {deletedLocationName && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Success!</strong>
                  <span className="block sm:inline"> Location{deletedLocationName === 'all locations' ? 's' : ''} "{deletedLocationName}" successfully deleted.</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg onClick={() => setDeletedLocationName(null)} className="fill-current h-6 w-6 text-green-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.546 6.354 14.849a1.2 1.2 0 0 1-1.697-1.697L8.303 10 4.651 6.354a1.2 1.2 0 0 1 1.697-1.697L10 8.454 13.646 4.801a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.651 3.303a1.2 1.2 0 0 1 0 1.697z" clipRule="evenodd"/></svg>
                  </span>
                </div>
              )}

              {deletedUserName && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Success!</strong>
                  <span className="block sm:inline"> User{deletedUserName === 'all users except your account' ? 's' : ''} "{deletedUserName}" successfully deleted.</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <svg onClick={() => setDeletedUserName(null)} className="fill-current h-6 w-6 text-green-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path fillRule="evenodd" d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.546 6.354 14.849a1.2 1.2 0 0 1-1.697-1.697L8.303 10 4.651 6.354a1.2 1.2 0 0 1 1.697-1.697L10 8.454 13.646 4.801a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.651 3.303a1.2 1.2 0 0 1 0 1.697z" clipRule="evenodd"/></svg>
                  </span>
                </div>
              )}

              {/* Locations Tab Content */}
              {activeTab === 'locations' && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium text-gray-700">All Locations</h2>
                    </div>
                    <div>
                      <button
                        onClick={handleDeleteAllLocations}
                        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${processingAllLocations || locations.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={processingAllLocations || locations.length === 0}
                        title="Delete All Locations"
                      >
                        <TrashIcon className="h-5 w-5 inline-block mr-1" /> Delete All
                      </button>
                      {errorAllLocations && <div className="text-red-500 text-sm mt-1">{errorAllLocations}</div>}
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
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
                                onClick={() => handleDeleteLocation(location.id, location.name)}
                                className={`text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out ${processingLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete Location"
                                disabled={processingLocation}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                              {errorLocation && <div className="text-red-500 text-sm mt-1">{errorLocation}</div>}
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
                </>
              )}

              {/* Users Tab Content */}
              {activeTab === 'users' && (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-medium text-gray-700">All Users</h2>
                    </div>
                    <div>
                      <button
                        onClick={handleDeleteAllUsers}
                        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${processingAllUsers || users.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={processingAllUsers || users.length <= 1}
                        title="Delete All Users Except Yourself"
                      >
                        <TrashIcon className="h-5 w-5 inline-block mr-1" /> Delete All
                      </button>
                      {errorAllUsers && <div className="text-red-500 text-sm mt-1">{errorAllUsers}</div>}
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-96 overflow-y-auto">
                    <table className="min-w-full bg-white">
                      <thead className="bg-gray-100 sticky top-0 z-10">
                        <tr>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Name</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Email</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Created At</th>
                          <th className="py-3 px-4 text-left font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className={`hover:bg-gray-50 ${user.id === currentUserId ? 'bg-blue-50' : ''}`}>
                            <td className="py-4 px-4 text-gray-800">
                              {user.name}
                              {user.id === currentUserId && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-gray-800">{user.email}</td>
                            <td className="py-4 px-4 text-gray-800">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className={`text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition duration-150 ease-in-out ${processingUser || user.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={user.id === currentUserId ? "Cannot delete your own account" : "Delete User"}
                                disabled={processingUser || user.id === currentUserId}
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                              {errorUser && <div className="text-red-500 text-sm mt-1">{errorUser}</div>}
                            </td>
                          </tr>
                        ))}

                        {users.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-4 px-4 text-center text-gray-500">
                              No users found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;