class Study < AactBase
  self.primary_key = 'nct_id'

  has_one  :brief_summary,         :foreign_key => 'nct_id'
  has_one  :design,                :foreign_key => 'nct_id'
  has_one  :detailed_description,  :foreign_key => 'nct_id'
  has_one  :eligibility,           :foreign_key => 'nct_id'
  has_one  :participant_flow,      :foreign_key => 'nct_id'
  has_one  :calculated_value,      :foreign_key => 'nct_id'

  has_many :baseline_measurements, :foreign_key => 'nct_id'
  has_many :baseline_counts,       :foreign_key => 'nct_id'
  has_many :browse_conditions,     :foreign_key => 'nct_id'
  has_many :browse_interventions,  :foreign_key => 'nct_id'
  has_many :central_contacts,      :foreign_key => 'nct_id'
  has_many :conditions,            :foreign_key => 'nct_id'
  has_many :countries,             :foreign_key => 'nct_id'
  has_many :design_outcomes,       :foreign_key => 'nct_id'
  has_many :design_groups,         :foreign_key => 'nct_id'
  has_many :design_group_interventions, :foreign_key => 'nct_id'
  has_many :drop_withdrawals,      :foreign_key => 'nct_id'

  has_many :facilities,            :foreign_key => 'nct_id'
  has_many :facility_contacts,     :foreign_key => 'nct_id'
  has_many :facility_investigators,:foreign_key => 'nct_id'
  has_many :id_information,        :foreign_key => 'nct_id'
  has_many :interventions,         :foreign_key => 'nct_id'
  has_many :intervention_other_names, :foreign_key => 'nct_id'
  has_many :keywords,              :foreign_key => 'nct_id'
  has_many :links,                 :foreign_key => 'nct_id'
  has_many :milestones,            :foreign_key => 'nct_id'
  has_many :outcomes,              :foreign_key => 'nct_id'
  has_many :outcome_analysis_groups, :foreign_key => 'nct_id'
  has_many :outcome_analyses,      :foreign_key => 'nct_id'
  has_many :outcome_measurements,  :foreign_key => 'nct_id'
  has_many :overall_officials,     :foreign_key => 'nct_id'
  has_many :references,            :foreign_key => 'nct_id'
  has_many :reported_events,       :foreign_key => 'nct_id'
  has_many :responsible_parties,   :foreign_key => 'nct_id'
  has_many :result_agreements,     :foreign_key => 'nct_id'
  has_many :result_contacts,       :foreign_key => 'nct_id'
  has_many :result_groups,         :foreign_key => 'nct_id'
  has_many :sponsors,              :foreign_key => 'nct_id'

  # clinwiki relationships
  has_many :reviews,          :foreign_key => 'nct_id'
  has_many :tags,             :foreign_key => 'nct_id'

  def self.retrieve(value=nil)
    col=[]
    response=[]
    case
      when value.blank?
        response = HTTParty.get('http://aact-dev.herokuapp.com/api/v1/studies?per_page=500')
        response.each{|r| col << instantiate_from(r)} if response
      when value.downcase.match(/^nct/)
        response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies/#{value}")]
        study=instantiate_from(response.first.first.last) if response
        col << study if study
      else
        # Search by Term
        page=1
        raw_response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?term=#{value.gsub(" ", "+")}&per_page=1000&page=#{page}")]
        response << JSON.parse(raw_response.to_json, object_class: OpenStruct)
        #while raw_response.first.size > 0 do

          #response << JSON.parse(raw_response.to_json, object_class: OpenStruct)
          #page=page+1
          #puts "Getting next set from page #{page}  Mesh Counter: #{raw_response.size}"
          #raw_response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?term=#{value.gsub(" ", "+")}&per_page=500&page=#{page}")]
        #end
        response.first.first.each{|entry|
          study=entry['_source']
          study.prime_address= ''
          study.reviews = Review.where('nct_id = ?',study['nct_id'])
          study.reveiws = [] if study.reviews.nil?
          study.average_rating = (study.reviews.size == 0 ? 0 : study.reviews.average(:rating).round(2))
          col << study
        }
        # Add Tagged Studies
        tagged=Tag.where('lower(value) like ?',"%#{value.downcase}%")
        tagged.each{|t|
          response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies/#{t.nct_id}")]
          study=instantiate_from(response.first['study']) if response
          col << study if study
        }
      end
      col
    end

  def display_start_date
    start_date.to_date.strftime('%B %Y') if start_date
  end

  def self.instantiate_from(hash)
    nct_id=hash['nct_id']
    study=JSON.parse(hash.to_json, object_class: OpenStruct)
    study.prime_address = ''
    study.reviews = Review.where('nct_id = ?',nct_id)
    study.reviews = [] if study.reviews.nil?
    study.tags = Tag.where('nct_id = ?',nct_id)
    study.tags = [] if study.tags.nil?
    study.average_rating = (study.reviews.size == 0 ? 0 : study.reviews.average(:rating).round(2))
    study
  end

end
