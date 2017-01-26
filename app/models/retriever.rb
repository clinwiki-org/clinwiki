class Retriever

  def self.get(value=nil)
    per_page=1000
    url="http://aact-dev.herokuapp.com/api/v1/studies?per_page=#{per_page}"
    col=[]
    response=[]
    case
    when value.blank?
        response = HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?per_page=#{per_page}")
        response.each{|r| col << instantiate_from(r)} if response
    when value.downcase.match(/^nct/)
        response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies/#{value}")]
        study=instantiate_from(response.first.first.last) if response
        col << study if study
    else
      # Search by Term
      page=1
      chunk = HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?term=#{value.gsub(" ", "+")}&per_page=#{per_page}&page=#{page}")
      until chunk.response.code_type != Net::HTTPOK
        response << chunk
        page=page+1
        puts "On page #{page} Status: #{chunk.response.code_type} Study count so far:  #{response.flatten.size}"
        chunk = HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?term=#{value.gsub(" ", "+")}&per_page=#{per_page}&page=#{page}")
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
