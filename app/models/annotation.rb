class Annotation < ActiveRecord::Base

  def self.init_lay_summary
    new({:label=>'lay summary', :description=>"- enter lay summary here -"})
  end

  def study
    Study.where('nct_id=?',nct_id).first
  end

end
