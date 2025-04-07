class DashboardController < ApplicationController
  include AuthorizeAdmin

  def index
    @locations = Location.includes(:user).all
    @total_locations = Location.count
    @total_users = User.count

    render inertia: "Dashboard", props: {
      locations: @locations.as_json(include: { user: { only: [ :id, :name, :email ] } }),
      totalLocations: @total_locations,
      totalUsers: @total_users
    }
  end

  def destroy_location
    location = Location.find(params[:id])
    location_name = location.name # Store the name before deleting
    location.destroy

    redirect_to dashboard_path, notice: "Location '#{location_name}' successfully deleted"
  end

  def destroy_all_locations
    Location.destroy_all

    redirect_to dashboard_path, notice: "All locations successfully deleted"
  end
end
