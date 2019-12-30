module Rack
  class Redirect
    def initialize(app)
      @app = app
    end

    def redirect(location)
      [302, { "Location" => location, "Content-Type" => "text/html" }, ["Moved Temporarily"]]
    end

    def current_site(subdomain)
      return Site.default if subdomain.blank? || subdomain.include?("localhost")

      valid_subdomains = Site.all.map(&:subdomain) + ["www", "staging", "experimental", "dev", "mysite"]

      if valid_subdomains.include?(subdomain) then
        return Site.find_by(subdomain: subdomain) || Site.default
      end
    end

    def get_subdomain(req)
      url = req.original_url
      uri =
        begin
          URI.parse url
        rescue StandardError
          nil
        end
      return nil if  uri.blank?
      return nil if  uri.host.blank?

      uri.host.split(".").first
    end

    def call(env)
      req = ActionDispatch::Request.new env
      if req.path == "/"
        subdomain = get_subdomain req
        site = current_site subdomain
        
        return redirect("/not-configured?subdomain=#{subdomain}") unless site

        return redirect("/search") if site&.skip_landing
      end
      @app.call(env)
    end
  end
end
