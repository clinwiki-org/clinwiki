module AuthHelpers
  def current_user(context = self.context)
    context[:current_user]
  end

  def decode_jwt(o_auth_token, kid)
    options = {
    algorithm: 'RS256',
    verify_aud: true,
    aud:ENV["GOOGLE_CLIENT_ID"],
    verify_iss: true,
    iss: "accounts.google.com"
    }
    uri = URI.parse("https://www.googleapis.com/oauth2/v3/certs")
    response = Net::HTTP.get_response(uri)
    hash = JSON.parse(response.body,:symbolize_names => true)[:keys].find {|cert| cert[:kid] == kid }
    JWT.decode(o_auth_token, nil, true, options) do |header|
      # get this from a GET request to https://www.googleapis.com/oauth2/v3/certs

    JWT::JWK.import(hash).keypair
    end
  end
end
