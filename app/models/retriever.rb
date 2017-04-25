class Retriever

  def self.get_study(nct_id)
    Study.find(nct_id)
  end

  def self.get(value=nil)
    col=[]
    return col if value.blank?
    case
    when value.downcase.match(/^nct/)
      study=Study.find(value) # They appear to be searching by the NCT ID
      col << study if study
    when !value.blank?
      # Search by Word or Phrase
      col=Study.find_by_term(value).uniq
      col << Tag.where('value=?',value).collect{|t|t.study}
    end
    col.flatten
  end

end
