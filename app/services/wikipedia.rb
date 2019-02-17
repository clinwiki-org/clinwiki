class Wikipedia
  class << self
    def url_for(search_text:)
      return nil if search_text.blank?

      query_url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=#{search_text}&format=json"
      wiki_data = get_json_response(query_url)

      pageid =
        begin
          wiki_data&.dig("query", "search", 0, "pageid")
        rescue StandardError
          logger.error("Wiki: Unexpected response structure for url #{query_url}")
          return nil
        end

      if pageid.blank?
        logger.error("Wiki: Couldn't extract page id for url #{query_url}")
        return nil
      end

      page_info_url =
        "https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=#{pageid}&inprop=url&format=json"

      wiki_page_info = get_json_response(page_info_url)

      begin
        wiki_page_info&.dig("query", "pages", pageid.to_s, "fullurl")
      rescue StandardError
        logger.error("Wiki: Unexpected response structure for url #{page_info_url}")
        return nil
      end
    end

    private

    def logger
      Rails.logger
    end

    def get_json_response(url)
      data = Faraday.get(url).body

      if data.blank?
        logger.error("Http client: Blank body for url: #{url}")
        return nil
      end

      begin
        JSON.parse(data)
      rescue StandardError => e
        logger.error("Http client: Error pasing JSON: #{e.message}. Body: #{data}")
        return nil
      end
    end
  end
end
