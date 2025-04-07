class HomeController < ApplicationController
  def index
    render inertia: "LocationList", props: {
      locations: Location.all
    }
  end
end
