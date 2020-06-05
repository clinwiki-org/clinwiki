module Types
  class UserType < BaseObject
    field :id, Int, "Id", null: false
    field :email, String, "Email", null: false
    field :first_name, String, "First name", null: true
    field :last_name, String, "Last name", null: true
    field :default_query_string, String, "Default query for user", null: true
    field :own_sites, [SiteType], null: false
    field :editor_sites, [SiteType], null: false
    field :roles, [String], null: false
    field :feeds, [FeedType], "Feed list. Available only for current user", null: false
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
    def own_sites
      return [] if current_user.blank?

      Site.with_role(:site_owner, current_user)
    end

    def rank
      ranking = JSON.parse(context[:current_site].user_rank)
      rank_sort = ranking.sort_by{|rank| rank["gte"]}.reverse
      rank = rank_sort.find{|rank| contributions >= rank["gte"]}
      rank["rank"]
    rescue JSON::ParserError
      "Error in parsing JSON string"
    end

    def editor_sites
      return [] if current_user.blank?

      res = Site.with_role(:site_editor, current_user).to_a
      res.push(Site.default) if current_user.has_role?(:admin)
      res
    end

    def feeds
      return [] unless context[:current_user]&.id == object.id

      object.feeds
    end

    def roles
      object.roles.map(&:name)
    end
  end
end
