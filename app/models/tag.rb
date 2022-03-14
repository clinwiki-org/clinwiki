class Tag < ApplicationRecord
  include TriggersStudyReindex
  include BelongsToStudy

  belongs_to :user

  def self.create_from(params, current_user)
    return false if params[:new_tag].strip.blank?
    return false if params[:nct_id].strip.blank?
    return false if current_user.blank?

    nct_id = params[:nct_id]
    value = params[:new_tag]
    user_id = current_user.id
    existing = where("nct_id=? and value=? and user_id=?", nct_id, value, user_id)
    return false unless existing.empty?

    create(nct_id: nct_id, value: value, user: current_user)
  end
end
