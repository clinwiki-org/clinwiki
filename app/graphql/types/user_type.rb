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
    field :liked_studies,[StudyType], null:true
    field :disliked_studies,[StudyType], null:true
    field :like_count, Integer, null: true
    field :dislike_count,Integer, null: true
    field :reactions, [ReactionType],null: true do
      argument :reaction_kind_id, String, required: false
      argument :limit, Integer, required: false
      argument :offset, Integer, required: false
    end
    field :reactions_count,[ExpressionCountType], null: true

    def reactions(reaction_kind_id: ReactionType.find_by_name("like").id, limit:25, offset:10)
      reaction_kind = ActiveRecord::Base.sanitize_sql(reaction_kind)
      limit = ActiveRecord::Base.sanitize_sql(limit)
      offset = ActiveRecord::Base.sanitize_sql(offset)
      object.reactions.where(reaction_kind_id:reaction_kind_id).limit(limit)
    end
    
    def review_count
      reviews.count
    end

    def reactions_count
      object.reaction_kinds.group(:name).count
    end

    def like_count
      object.reaction_kinds.where(name:"like").count
    end

    def dislike_count
      object.reaction_kinds.where(name:"dislike").count
    end

    def liked_studies
      reactions = object.reactions.joins(:reaction_kind).where({reaction_kinds:{name:"like"}})
      reactions.map{|reaction| reaction.study}
    end

    def disliked_studies
      reactions = object.reactions.joins(:reaction_kind).where({reaction_kinds:{name:"dislike"}})
      reactions.map{|reaction| reaction.study}
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
