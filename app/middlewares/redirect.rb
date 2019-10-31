module Rack
  class Redirect
    def initialize(app)
      @app = app
    end

    def redirect(location)
      [302, { "Location" => location, "Content-Type" => "text/html" }, ["Moved Temporarily"]]
    end

    def current_site(req)
      url = req.headers["ORIGIN"] || req.headers["REFERER"]
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

    def call(env)
      req = ActionDispatch::Request.new env
      if req.path == "/"
        site = current_site req
        return redirect("/search") if site&.skip_landing
      end
      @app.call(env)
    end
  end
end
