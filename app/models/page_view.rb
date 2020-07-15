class PageView < ApplicationRecord
  belongs_to :site
  validates :site, presence: true
  enum page_type: [ :study ]
  validates :url, uniqueness: { scope: :site }
  include MutationHelpers



end
