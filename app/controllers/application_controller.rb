class ApplicationController < ActionController::Base
  layout "application"
  protect_from_forgery with: :exception
  before_action :configure_devise_permitted_parameters, if: :devise_controller?
  before_action :authenticate_user!, except: [:user_exists]


  def user_exists
    if current_user
      render json: {
        loggedIn: true,
        email: current_user.email,
        id: current_user.id,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        default_query_string: current_user.default_query_string,
        search_result_columns: current_user.search_result_columns,
      }
    else
      render json: { loggedIn: false }
    end
  end

  protected

  def configure_devise_permitted_parameters
    registration_params = [:first_name, :last_name, :email, :password, :password_confirmation, :default_query_string]

    if params[:action] == 'update'
      devise_parameter_sanitizer.permit(:account_update) {
        |u| u.permit(registration_params << :current_password)
      }
    elsif params[:action] == 'create'
      devise_parameter_sanitizer.permit(:sign_up) {
        |u| u.permit(registration_params)
      }
    end
  end
end
