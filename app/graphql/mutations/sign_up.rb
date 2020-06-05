module Mutations
  class SignUp < BaseMutation
    field :jwt, String, "Json web token", null: true
    field :user, Types::UserType, "Signed up user", null: true
    field :errors, [String], null: true

    argument :email, String, required: true
    argument :password, String, required: false
    argument :default_query_string, String, required: false
    argument :o_auth_token, String, required:false

    def resolve(email:, password:, default_query_string: nil, o_auth_token:nil)
      picture_url= nil
      hmac_secret = Rails.application.secrets.secret_key_base
      exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400
      raise GraphQL::ExecutionError, "SECRET_KEY_BASE env variable is not set" if hmac_secret.blank?
      if o_auth_token
        return { jwt: nil, user: nil, errors: ["Oauth token not three segments"] } if !o_auth_token.split(".").size.eql? 3
        header = Base64.decode64 (o_auth_token.split(".")[0])
        kid = header ? JSON.parse(header)["kid"] : nil
        return { jwt: nil, user: nil, errors: ["Oauth token missing kid"] } if !kid
        payload, header = decode_jwt(o_auth_token, kid)
        email = payload["email"]
        password = Devise.friendly_token(8)
        provider = payload["iss"]
        picture_url = payload["picture"]
      end
      user = User.find_by(email: email)
      return { jwt: nil, user: nil, errors: ["Email already exists"] } if user

      user = User.new(email: email, default_query_string: default_query_string, picture_url: picture_url)
      user.password = password
      # user.provider = provider if provider

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
