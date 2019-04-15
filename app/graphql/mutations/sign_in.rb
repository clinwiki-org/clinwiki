module Mutations
  class SignIn < BaseMutation
    field :jwt, String, "Json web token", null: true
    field :user, Types::UserType, "Signed in user", null: true

    argument :email, String, required: true
    argument :password, String, required: true

    def resolve(email:, password:)
      user = User.find_by(email: email)
      return nil unless user
      return nil unless user.valid_password?(password)

      hmac_secret = Rails.application.secrets.secret_key_base
      exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400
      raise GraphQL::ExecutionError, "SECRET_KEY_BASE env variable is not set" if hmac_secret.blank?

      exp = Time.now.to_i + exp_secs.to_i
      jwt = JWT.encode({ email: user.email, exp: exp }, hmac_secret, "HS256")

      { jwt: jwt, user: user }
    end
  end
end
