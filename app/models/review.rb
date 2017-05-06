class Review < ActiveRecord::Base
  include ReindexStudyHelper

  belongs_to :user
  belongs_to :study, :foreign_key => 'nct_id'
  validates :rating, :comment, presence: true

  def self.types
    ['Accessibility','Design','Outcomes']
  end

end
