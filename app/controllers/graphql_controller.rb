class GraphqlController < ApplicationController
  skip_before_action :verify_authenticity_token
  skip_before_action :authenticate_user!

  def execute
    variables = ensure_hash(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = {
      current_user: current_user,
      current_site: current_site,
      current_url: current_url,
    }
    result = ClinwikiSchema.execute(query, variables: variables, context: context, operation_name: operation_name)
    render json: result
  end

  private

  def current_site
    url = request.original_url
    uri =
      begin
        URI.parse(url)
      rescue StandardError
        nil
      end
    return nil if  uri.blank?
    return nil if  uri.host.blank?

    subdomain = uri.host.split(".").first
    return nil if subdomain.blank?

    Site.find_by(subdomain: subdomain) || Site.default
  end

  def current_url
    url = request.original_url
    uri =
      begin
        URI.parse(url)
      rescue StandardError
        nil
      end
    return nil if  uri.blank?
    return nil if  uri.host.blank?
    uri.to_s
  end

  # Raises JWT::ExpiredSignature if signature is expired
  def current_user
    auth_header = request.headers["Authorization"]
    matches = /Bearer (.*)/i.match(auth_header)
    return nil if matches.blank?

    hmac_secret = Rails.application.secrets.secret_key_base
    raise "SECRET_KEY_BASE is not set" if hmac_secret.blank?

    token = matches[1]
    payload =
      begin
        JWT.decode token, hmac_secret, true, algorithm: "HS256"
      rescue StandardError => e
        Rails.logger.error("Error parsing token for header `#{request.headers['Authorization']}`: #{e}")
        return nil
      end

    email = payload&.dig(0, "email")
    return nil if email.blank?

    User.find_by(email: email)
  end

  # Handle form data, JSON body, or a blank value
  def ensure_hash(ambiguous_param)
    case ambiguous_param
    when String
      if ambiguous_param.present?
        ensure_hash(JSON.parse(ambiguous_param))
      else
        {}
      end
    when Hash, ActionController::Parameters
      ambiguous_param
    when nil
      {}
    else
      raise ArgumentError, "Unexpected parameter: #{ambiguous_param}"
    end
  end
end
