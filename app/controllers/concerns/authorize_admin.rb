module AuthorizeAdmin
    extend ActiveSupport::Concern

    included do
      before_action :check_admin
    end

    private

    def check_admin
      unless current_user&.admin?
        redirect_to "/", alert: "You don't have permission to access this page."
      end
    end
end
