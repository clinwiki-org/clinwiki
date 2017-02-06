class Retriever

  def self.get_study(nct_id)
    response = HTTParty.get("https://clinicaltrials.gov/show/#{nct_id}?resultsxml=true")
    r=response.to_hash['clinical_study'] if response
    instantiate_from(r) if r
  end

  def self.get(value=nil)
    per_page=1000
    url="http://aact-dev.herokuapp.com/api/v1/studies?per_page=#{per_page}"
    col=[]
    response=[]
    return [] if value.blank?
    case
    when value.downcase.match(/^nct/)
        response = HTTParty.get("https://clinicaltrials.gov/show/#{value}?resultsxml=true")
        r=response.to_hash['clinical_study'] if response
        study=instantiate_from(r) if r
        col << study if study
    when !value.blank?
      # Search by Term
      page=1
      val=value.gsub(" ", "+")
      url = "#{url}&term=#{val}&page=#{page}"
      chunk = HTTParty.get(url)
      until chunk.response.code_type != Net::HTTPOK
        response << chunk
        page=page+1
        puts "On page #{page} Status: #{chunk.response.code_type} Study count so far:  #{response.flatten.size}"
        chunk = HTTParty.get("#{url}&term=#{val}&page=#{page}")
      end
      response.flatten.each{|entry|
        study=instantiate_from(entry['_source'])
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
