class Tag < ActiveRecord::Base
  belongs_to :user

  def self.create_from(params,current_user)
    return false if params[:new_tag].strip.blank?
    return false if params[:nct_id].strip.blank?
    return false if current_user.blank?
    new({:nct_id=>params['nct_id'],:value=>params[:new_tag],:user=>current_user}).save!
  end
end
