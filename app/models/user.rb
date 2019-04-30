class User < ApplicationRecord
  rolify
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :reviews, dependent: :destroy
  has_many :user_session_studies, dependent: :destroy
  has_many :feeds, dependent: :destroy

  def admin?
    false
  end

  def full_name
    "#{first_name} #{last_name}"
  end
end
