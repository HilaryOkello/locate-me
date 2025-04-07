class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  before_action :configure_permitted_parameters, if: :devise_controller?
  allow_browser versions: :modern
  before_action :authenticate_user!
  inertia_share user: -> { current_user }

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name ])
  end

  private

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path # Redirects to the login page after logout
  end
end
