# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

10.times do # Create 20 fake locations (you can adjust this number)
    Location.create(
      name: Faker::Address.city,
      latitude: Faker::Address.latitude,
      longitude: Faker::Address.longitude,
      user: User.first # Associate the location with the user
    )
end