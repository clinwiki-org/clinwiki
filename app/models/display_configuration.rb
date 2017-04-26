class DisplayConfiguration < ActiveRecord::Base

  def self.sections
    select(:render_in_section).distinct.pluck(:render_in_section)
  end

  def self.display_info_for(section, nct_id)
    entries=DisplayConfiguration.where('render_in_section=?',section)
    return [] if entries.size == 0
    configs=[]
    entries.each{|entry|
      val=Study.connection.execute("select #{entry.column_name} from #{entry.table_name} where nct_id='#{nct_id}'").try(:first)
      label=entry.column_name.downcase
      configs << {:label=>label,:value=>val[label]}
    }
    return configs
  end

end
