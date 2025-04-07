# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Create default users if they don't exist
unless User.exists?(email: 'hilary@example.com')
  User.create!(
    email: 'hilary@example.com',
    password: 'password123',
    name: 'Hilary',
    role: 'user',
    created_at: '2025-04-06 11:24:14.310045000 +0000',
    updated_at: '2025-04-07 04:45:28.428300000 +0000'
  )
  puts 'Created user: Hilary'
end

unless User.exists?(email: 'paul@example.com')
  User.create!(
    email: 'paul@example.com',
    password: 'password123',
    name: 'Paul',
    role: 'user',
    created_at: '2025-04-07 16:35:00.288162000 +0000',
    updated_at: '2025-04-07 16:49:35.513723000 +0000'
  )
  puts 'Created user: Paul'
end

unless User.exists?(email: 'john@example.com')
  User.create!(
    email: 'john@example.com',
    password: 'password123',
    name: 'John',
    role: 'user',
    created_at: '2025-04-07 16:29:40.802979000 +0000',
    updated_at: '2025-04-07 17:02:53.498800000 +0000'
  )
  puts 'Created user: John'
end

# Create an admin user if they don't exist
unless User.exists?(email: 'admin@example.com')
  User.create!(
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    created_at: '2025-04-07 14:52:21.385591000 +0000',
    updated_at: '2025-04-07 17:02:12.079766000 +0000'
  )
  puts 'Created admin user: Admin User'
end

# Fetch the three non-admin users
users = User.where.not(role: 'admin').limit(3)

# This list contains the locations around Kisumu with their approximate coordinates.
locations_with_coordinates = [
  { name: 'Kisumu Museum', latitude: -0.0917, longitude: 34.7560 },
  { name: 'Kisumu Impala Sanctuary', latitude: -0.0850, longitude: 34.7350 },
  { name: 'Hippo Point', latitude: -0.1180, longitude: 34.7720 },
  { name: 'Dunga Hill Camp', latitude: -0.1400, longitude: 34.7850 },
  { name: 'Kisumu Yacht Club', latitude: -0.0800, longitude: 34.7500 },
  { name: 'Kibuye Market', latitude: -0.0950, longitude: 34.7650 },
  { name: 'Jomo Kenyatta International Airport', latitude: -1.3275, longitude: 36.9275 }, # Example slightly further
  { name: 'Kisumu CBD', latitude: -0.0919, longitude: 34.7558 },
  { name: 'Lwang\'ni Beach', latitude: -0.1050, longitude: 34.7900 },
  { name: 'Riat Hills', latitude: -0.0500, longitude: 34.7000 } # Example slightly outside
]

# Add locations with coordinates, assigning them randomly to the selected users
locations_with_coordinates.each do |loc_data|
  user = users.sample

  Location.find_or_create_by!(name: loc_data[:name], user: user) do |location|
    location.latitude = loc_data[:latitude]
    location.longitude = loc_data[:longitude]
    location.user_id = user.id # Explicitly set user_id
    location.created_at = Time.now
    location.updated_at = Time.now
  end
  puts "Created location: #{loc_data[:name]} for user: #{user.name}"
end

puts "Successfully seeded users and 10 locations around Kisumu."
