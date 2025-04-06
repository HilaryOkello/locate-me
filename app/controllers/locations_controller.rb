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

end
