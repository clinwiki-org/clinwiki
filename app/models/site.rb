class Site < ApplicationRecord
  resourcify

  has_many :site_views, dependent: :destroy
  has_many :study_views, dependent: :destroy

  after_create :create_site_view

  validates :name, :subdomain, uniqueness: true

  class << self
    def default
      @default_site = Site.find_or_create_by(name: "default", subdomain: "default")
    end
  end

  def save_editors(editor_emails)
    emails = editor_emails.is_a?(Array) ? editor_emails : [editor_emails]
    existing = id.blank? ? [] : User.with_role(:site_editor, self)
    new_editors = User.where(email: emails).to_a
    (new_editors - existing).map do |user|
      user.add_role(:site_editor, self)
    end
    (existing - new_editors).map do |user|
      user.remove_role(:site_editor, self)
    end
  end

  private

  def create_site_view
    self.site_views.new(name:"Primary",default:true)
    self.site_views.new(name:"User History",url:"user", default: false, updates: Site.default_user_updates )
    self.site_views.new(name:"Intervention",url:"intervention",default:false, updates: Site.default_intervention_updates )
    save!
  end

  def self.default_user_updates
    [ {"path"=>["search", "config", "fields", "showFacetBar"],
         "payload"=>"false",
         "operation"=>"set"},
        {"path"=>["search", "config", "fields", "showAutoSuggest"],
         "payload"=>"false",
         "operation"=>"set"},
        {"path"=>["search", "config", "fields", "showBreadCrumbs"],
         "payload"=>"false",
         "operation"=>"set"},
        {"path"=>["search", "config", "fields", "showResults"],
         "payload"=>"true",
         "operation"=>"set"},
     {"path"=>["search", "type"],
     "payload"=>"user",
         "operation"=>"set"}
    ]
  end
  def self.default_intervention_updates
    [
      {"path"=>["search", "type"], "payload"=>"search", "operation"=>"set"},
      {"path"=>["search", "config", "fields", "showBreadCrumbs"],
        "payload"=>"false",
        "operation"=>"set"},
      {"path"=>["search", "config", "fields", "showAutoSuggest"],
        "payload"=>"false",
        "operation"=>"set"},
      {"path"=>["search", "config", "fields", "showFacetBar"],
        "payload"=>"false",
        "operation"=>"set"},
      {"path"=>["search", "type"],
        "payload"=>"intervention",
        "operation"=>"set"}]
  end
end
