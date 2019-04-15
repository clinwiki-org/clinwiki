module Mutations
  class SignUp < BaseMutation
    field :jwt, String, "Json web token", null: true
    field :user, Types::UserType, "Signed up user", null: true
    field :errors, [String], null: true

    argument :email, String, required: true
    argument :password, String, required: true
    argument :default_query_string, String, required: false

    def resolve(email:, password:, default_query_string: nil)
      hmac_secret = Rails.application.secrets.secret_key_base
      exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400
      raise GraphQL::ExecutionError, "SECRET_KEY_BASE env variable is not set" if hmac_secret.blank?

      user = User.find_by(email: email)
      return { jwt: nil, user: nil, errors: ["Email already exists"] } if user

      user = User.new(email: email, default_query_string: default_query_string)
      user.password = password

      if user.save
        exp = Time.now.to_i + exp_secs.to_i
        jwt = JWT.encode({ email: user.email, exp: exp }, hmac_secret, "HS256")
        { jwt: jwt, user: user, errors: nil }
      else
        { jwt: nil, user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
