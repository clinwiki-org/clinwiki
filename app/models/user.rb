class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
	has_many :reviews
	has_many :user_session_studies

	def admin?
		false
	end

	def full_name
		first_name + ' ' + last_name
	end
end
