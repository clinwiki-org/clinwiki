class Site < ApplicationRecord
  resourcify

  has_many :site_views, dependent: :destroy

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
    save!
  end
end
