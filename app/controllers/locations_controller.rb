class LocationsController < ApplicationController
  def create
    @location = current_user.locations.new(location_params)
    if @location.save
      redirect_to root_path, success: "Location saved successfully!"
    else
      render inertia: "LocationList", props: { errors: @location.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def location_params
    params.require(:location).permit(:name, :latitude, :longitude)
  end
end