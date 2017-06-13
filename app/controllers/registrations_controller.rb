class RegistrationsController < Devise::RegistrationsController
  skip_before_filter :verify_authenticity_token

  clear_respond_to
  respond_to :json
end
