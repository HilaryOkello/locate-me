Rails.application.routes.draw do
  # Set routes for Devise auth
  devise_for :users

  # Set root to the new home controller
  root to: 'home#index'

  # Define routes for locations (create and destroy only)
  resources :locations, only: [:create, :destroy]

  # Define the admin dashboard route directly (no namespace)
  get '/dashboard', to: 'dashboard#index'
  delete '/dashboard/locations/:id', to: 'dashboard#destroy_location', as: 'destroy_location'
  delete '/dashboard/locations', to: 'dashboard#destroy_all_locations', as: 'destroy_all_locations' # New route

  # Define the health check route
  get "up" => "rails/health#show", as: :rails_health_check

  # PWA routes (commented out, uncomment if needed)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/") - already defined above
  # root "posts#index"
end