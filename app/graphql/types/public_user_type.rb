module Types
  class PublicUserType < BaseObject
    field :id, Int, "Id", null: false
    field :first_name, String, "First name", null: true
    field :last_name, String, "Last name", null: true
    field :review_count, Integer, "Number of reviews the user has done", null: false
    field :reviews, [ReviewType], null: false
    field :contributions, Integer, null: false
    field :picture_url, String, null: true
    field :rank, String, null: true

    def review_count
      reviews.count
    end

    def contributions
      object.wiki_pages.distinct.count
    end
    def rank
      ranking = JSON.parse(context[:current_site].user_rank)
      rank_sort = ranking.sort_by{|rank| rank["gte"]}.reverse
      rank = rank_sort.find{|rank| contributions >= rank["gte"]}
      rank["rank"]
    rescue JSON::ParserError
      "Error in parsing JSON string"
    end

  end
end
