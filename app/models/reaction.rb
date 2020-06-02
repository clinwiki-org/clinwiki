class Reaction < ApplicationRecord
  belongs_to :user
  include BelongsToStudy
  belongs_to :reaction_kind
  validates :reaction_kind_id, :nct_id, :user_id, presence: true
  validates :nct_id,  uniqueness: { scope: [:user_id,:reaction_kind_id], message:"User has one reaction of each kind per study"}
  validate :reaction_kind_exists
  validate :user_exists


  def user_exists
    if User.exists?(self.user_id)
     return true
    else
     self.errors.add(:user, "Unable to find this user.")
     return false
    end
  end

 def reaction_kind_exists
   if ReactionKind.exists?(self.reaction_kind_id)
    return true
   else
    self.errors.add(:reaction, "Unable to find this reaction.")
    return false
   end
 end
 def reaction_name
   reaction_kind.name
 end
end
