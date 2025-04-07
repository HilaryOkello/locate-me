class HomeController < ApplicationController
  def index
    locations = Location.all.includes(:user).map do |location|
      location.as_json.merge(user_name: location.user.name)
    end

    render inertia: "LocationList", props: {
      locations: locations
    }
  end
end
