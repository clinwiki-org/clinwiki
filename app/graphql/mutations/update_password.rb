module Mutations
  class UpdatePassword < BaseMutation
    field :user, Types::UserType, null: false
    field :errors, String,"Errors with token, either does not match user or expired", null:false
    field :jwt, String,"Sign in token if no error", null:true

    argument :reset_password_token, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    def resolve(attrs)
      user = User.reset_password_by_token(attrs)
      jwt = user.errors.full_messages.empty? ? jwt(user.email)  : nil
      {
        user: user,
        errors: user.errors.full_messages,
        jwt: jwt
      }
    end


    def jwt(email)
      hmac_secret = Rails.application.secrets.secret_key_base
      exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400
      exp = Time.now.to_i + exp_secs.to_i
      JWT.encode({ email: email, exp: exp }, hmac_secret, "HS256")
    end
  end
end
