class UserSessionStudy < ApplicationRecord
  belongs_to :user
  has_many :reviews, dependent: :destroy
  has_many :tags, dependent: :destroy
end
