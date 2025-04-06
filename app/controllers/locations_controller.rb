class LocationsController < ApplicationController
    def index
        render inertia: 'LocationList'
    end
end
