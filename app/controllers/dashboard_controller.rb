class DashboardController < ApplicationController
  include AuthorizeAdmin

  def index
    @locations = Location.includes(:user).all
    @users = User.all
    @total_locations = Location.count
    @total_users = User.count

    render inertia: "Dashboard", props: {
      locations: @locations.as_json(include: { user: { only: [ :id, :name, :email ] } }),
      users: @users.as_json(only: [ :id, :name, :email, :created_at ]),
      totalLocations: @total_locations,
      totalUsers: @total_users,
      currentUserId: current_user.id # Pass current user ID to the frontend
    }
  end

  def destroy_location
    location = Location.find(params[:id])
    location_name = location.name
    location.destroy

    redirect_to dashboard_path, notice: "Location '#{location_name}' successfully deleted"
  end

  def destroy_all_locations
    Location.destroy_all

    redirect_to dashboard_path, notice: "All locations successfully deleted"
  end

  def destroy_user
    user = User.find(params[:id])

    # Prevent admin from deleting their own account
    if user.id == current_user.id
      return redirect_to dashboard_path, alert: "You cannot delete your own account"
    end

    user_name = user.name
    user.destroy

    redirect_to dashboard_path, notice: "User '#{user_name}' successfully deleted"
  end

  def destroy_all_users
    # Exclude the current admin from the deletion
    User.where.not(id: current_user.id).destroy_all

    redirect_to dashboard_path, notice: "All users except your account successfully deleted"
  endirect_to dashboard_path, notice: "All users successfully deleted"
  end
end
