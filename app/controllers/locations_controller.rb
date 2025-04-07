class LocationsController < ApplicationController
    def create
        @location = current_user.locations.new(location_params)
        if @location.save
          render inertia: 'LocationList', props: {
            success: 'Location saved successfully!',
            locations: current_user.locations.all
          }, url: '/' 
        else
          render inertia: 'LocationList', props: { errors: @location.errors.full_messages }, status: :unprocessable_entity, url: '/'
        end
      end

    private

    def location_params
        params.require(:location).permit(:name, :latitude, :longitude)
    end

end
