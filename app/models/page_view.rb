class PageView < ApplicationRecord
  belongs_to :site
  validates :site, presence: true
  enum page_type: [ :study ]
  validates :url, uniqueness: { scope: :site }
  include MutationHelpers

  before_save do
    if default_changed? && default
      old_default = site.page_views.find_by(default: true)
      site.page_views.where.not(id: id).update_all(default: false)
    end
  end


end
