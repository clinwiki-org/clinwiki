class CwpasswordsController < Devise::PasswordsController
  skip_before_filter :verify_authenticity_token, :verify_signed_out_user

  def create
    resource_params.merge!(locale: 'en') # use 'en' for eg
    super
  end

  def update
    p params
    if params.has_key?('reset')
      @user = User.find_by_email(params['email'])
      if @user.present?
       @user.send_reset_password_instructions
       render :json => { success: true }
      else
       render :json => { success: false }
      end
    else
      super
    end
  end
end
