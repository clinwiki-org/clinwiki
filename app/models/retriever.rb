class Retriever

  def self.get_study(nct_id)
    response = HTTParty.get("https://clinicaltrials.gov/show/#{nct_id}?resultsxml=true")
    r=response.to_hash['clinical_study'] if response
    Study.find(r['nct_id']) if r
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
