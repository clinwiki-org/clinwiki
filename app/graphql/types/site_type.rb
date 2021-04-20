module Types
  class SiteType < Types::BaseObject
    field :id, Int, null: false
    field :name, String, null: false
    field :subdomain, String, null: false
    field :default_hash, String, null: false
    field :default_search_page, String, null: false
    field :skip_landing, Boolean, null: true
    field :hide_donation, Boolean, null: true
    field :owners, [UserType], null: false
    field :editors, [UserType], null: false
    field :site_views, [SiteViewType], null: false
    field :themes, String, null: false
    field :reactions_config, String, null: false
    field :site_view, SiteViewType, null: false do
      argument :url, type: String, required: false
    end
    field :page_views, [PageViewType], null:true
    field :page_view,PageViewType, null:true do
      argument :url, type: String, required: false
    end
    field :user_rank, type:String,null: false

    def owners
      User.with_role(:site_owner, object)
    end

    def editors
      User.with_role(:site_editor, object)
    end

    def site_views
      Loaders::Association.for(Site, :site_views).load(object)
    end

  def site_view(url: nil)
      return object.site_views.find_by(default: true) unless url
      site_view = object.site_views.find_by(url: url)
      return object.site_views.find_by(default: true) unless site_view
      return site_view
  end

    def page_view(url:nil)
      case url
      when nil
        object.page_views.where(default:true).first
      else
        object.page_views.find_by(url: url)
      end
    end
  end
end
