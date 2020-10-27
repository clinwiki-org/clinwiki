class ReactionKind < ApplicationRecord
  has_many :reactions
  has_many :studies,through: :reactions
  validates :name, :unicode, presence: true
end
