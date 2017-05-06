require '../helpers/reindex_study'
class Annotation < ActiveRecord::Base
  include ReindexStudyHelper

  belongs_to :study, :foreign_key => 'nct_id'

  def self.init_lay_summary
    new({:label=>'lay summary', :description=>'enter a lay summary here'})
  end

end
