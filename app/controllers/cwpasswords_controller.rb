# rubocop:disable all
class CwpasswordsController < Devise::PasswordsController
  skip_before_action :verify_authenticity_token, :verify_signed_out_user, raise: false

  def create
    resource_params.merge!(locale: 'en') # use 'en' for eg
    super
  end

  def update
    if params.has_key?('reset')
      @user = User.find_by_email(params['email'])
      if @user.present?
       @user.send_reset_password_instructions
       return render :json => { success: true }, status: 200
      else
       render :json => { success: false }
      end
    else
      self.resource = resource_class.reset_password_by_token(resource_params)
      yield resource if block_given?

      if resource.errors.empty?
        resource.unlock_access! if unlockable?(resource)
        if Devise.sign_in_after_reset_password
          sign_in(resource_name, resource)
        end
        render :json => { success: true }, status: 200
      else
        set_minimum_password_length
        render :json => { success: false, errors: resource.errors }, status: 400
      end
    end
  end
end
