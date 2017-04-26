class DisplayConfiguration < ActiveRecord::Base

  def self.sections
    from_table=select(:render_in_section).distinct.pluck(:render_in_section)
  end

  def self.display_info_for(section, nct_id)
    entries=where('render_in_section=?', section)
    return [] if entries.size == 0
    configs=[]
    entries.each{|entry|
      if entry.column_name.blank?
        table=entry.table_name
        rows=Study.connection.execute("select * from #{table} where nct_id='#{nct_id}'")
        rows.each{|row|
          e=''
          row.each{|key,value|
            e << "#{value}, " if !['id','nct_id','created_at','updated_at'].include? key and !value.blank?
          }
          configs << {:label=>'',:value=>e.chomp(', ')}
        }
      else
        val=Study.connection.execute("select #{entry.column_name} from #{entry.table_name} where nct_id='#{nct_id}'").try(:first)
        label=entry.column_name.downcase
        configs << {:label=>label,:value=>val[label]} if !val.blank?
      end
    }
    return configs
  end

end
