class LocationsController < ApplicationController
    def index
        render inertia: 'LocationList', props: {
            locations: current_user.locations
        }
    end

    def show
        render inertia: 'Location', props: {
            location: current_user.locations.find(params[:id]),
        }
    end

    def create
        @location = current_user.locations.new(location_params)
    
        if @location.save
          render inertia: 'LocationList', props: {
            success: 'Location saved successfully!',
            locations: current_user.locations.all
          }, url: '/' # Try explicitly setting the URL
        else
          render inertia: 'LocationList', props: { errors: @location.errors.full_messages }, status: :unprocessable_entity, url: '/' # And here
        end
      end

    private

    def location_params
        params.require(:location).permit(:name, :latitude, :longitude)
    end

end
