require 'reindexes_study'
class Review < ReindexesStudy
  belongs_to :user
  validates :rating, :comment, presence: true

  def self.types
    ['Accessibility','Design','Outcomes']
  end

end
