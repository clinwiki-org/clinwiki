module Mutations
  class SignIn < BaseMutation
    field :jwt, String, "Json web token", null: true
    field :user, Types::UserType, "Signed in user", null: true

    argument :email, String, required: true
    argument :password, String, required: false
    argument :o_auth_token, String, required:false

  def resolve(email:, password:, o_auth_token: nil)
      if o_auth_token && !o_auth_token.empty?
        return { jwt: nil, user: nil, errors: ["Oauth token not three segments"] } if !o_auth_token.split(".").size.eql? 3
        header = Base64.decode64 (o_auth_token.split(".")[0])
        kid = header ? JSON.parse(header)["kid"] : nil
        return { jwt: nil, user: nil, errors: ["Oauth token missing kid"] } if !kid
        payload, header = decode_jwt(o_auth_token, kid)
        provider = payload["iss"]
        user = User.find_or_create_from_payload(payload)
      else
        user = User.find_by(email:email)
        return nil unless user
        return nil unless user.valid_password?(password)
      end

      hmac_secret = Rails.application.secrets.secret_key_base
      exp_secs = ENV["JWT_EXPIRATION_TIME_SECS"] || 86_400
      raise GraphQL::ExecutionError, "SECRET_KEY_BASE env variable is not set" if hmac_secret.blank?

      exp = Time.now.to_i + exp_secs.to_i
      jwt = JWT.encode({ email: user.email, exp: exp }, hmac_secret, "HS256")

      { jwt: jwt, user: user }
    end
  end
end
