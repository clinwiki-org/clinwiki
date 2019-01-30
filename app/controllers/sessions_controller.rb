class SessionsController < Devise::SessionsController
  skip_before_action :verify_authenticity_token, :verify_signed_out_user
  respond_to :json

  # DELETE /resource/sign_out
  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out

    yield if block_given?
    respond_to_on_destroy
  end


  def verify_signed_out_user
    if all_signed_out?
      respond_to_on_destroy
    end
  end

end
