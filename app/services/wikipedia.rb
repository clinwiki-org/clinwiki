class Wikipedia
  class << self
    def find_article(search_text:)
      return nil if search_text.blank?

      result = WikipediaArticle.new

      query_url = "https://en.wikipedia.org/w/api.php"\
                  "?format=json&action=query&prop=extracts&exintro"\
                  "&explaintext&redirects=1&titles=#{search_text}"
      wiki_data = get_json_response(query_url)

      begin
        page = wiki_data&.dig("query", "pages")&.values&.first
        result.title = page&.dig("title")
        result.description = page&.dig("extract")
        result.id = page&.dig("pageid")&.to_i
      rescue StandardError
        logger.error("Wiki: Unexpected response structure for url #{query_url}")
        return nil
      end
      if result.id.blank?
        logger.error("Wiki: Couldn't extract page id for url #{query_url}")
        return nil
      end

      begin
        page_info_url =
          "https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=#{result.id}&inprop=url&format=json"

        wiki_page_info = get_json_response(page_info_url)

        result.url = wiki_page_info&.dig("query", "pages", result.id.to_s, "fullurl")
      rescue StandardError
        logger.error("Wiki: Unexpected response structure for url #{page_info_url}")
        return nil
      end

      result
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
