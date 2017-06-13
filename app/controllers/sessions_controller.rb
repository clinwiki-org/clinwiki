class SessionsController < Devise::SessionsController
  skip_before_filter :verify_authenticity_token
  respond_to :json

end
