require 'reindexes_study'
class Annotation < ReindexesStudy

  def self.init_lay_summary
    new({:label=>'lay summary', :description=>'enter a lay summary here'})
  end

end
