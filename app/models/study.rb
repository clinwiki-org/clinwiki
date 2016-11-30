class Study < ActiveRecord::Base

  self.primary_key = 'nct_id'

    def self.all_nctids
      all.collect{|s|s.nct_id}
    end

    def average_rating
      if reviews.size==0
        0
      else
        reviews.average(:rating).round(2)
      end
    end

    def intervention_names
      interventions.collect{|x|x.name}.join(', ')
    end

    def condition_names
      conditions.collect{|x|x.name}.join(', ')
    end

    def self.retrieve(value=nil)
      col=[]
      response=[]
      case
        when value.blank?
          response = HTTParty.get('http://aact-dev.herokuapp.com/api/v1/studies?per_page=50')
          response.each{|r| col << instantiate_from(r)} if response
        when value.downcase.match(/^nct/)
          response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies/#{value}")]
          study=instantiate_from(response.first['study']) if response
          col << study if study
        else
          # Search by MeSH Term
          page=1
          mesh_response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?mesh_term=#{value.gsub(" ", "+")}&per_page=50&page=#{page}")]
          while mesh_response.first.size > 0 do

            response << JSON.parse(mesh_response.to_json, object_class: OpenStruct)
            page=page+1
            puts "Getting next set from page #{page}  Mesh Counter: #{response.size}"
            mesh_response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?mesh_term=#{value.gsub(" ", "+")}&per_page=50&page=#{page}")]
          end
          response.flatten.uniq.each{|study|
            study.prime_address= ''
            study.reviews = Review.where('nct_id = ?',study['nct_id'])
            study.reveiws = [] if study.reviews.nil?
            study.average_rating = (study.reviews.size == 0 ? 0 : study.reviews.average(:rating).round(2))
            col << study
          }

#  Exclude Orgs for now.  Current (free) Heroku can't handle it.  Consistently runs out of memory.
          # Search by Organization
#          response=[]
#          page=1
#          org_response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?organization=#{value.gsub(" ", "+")}&per_page=50&page=#{page}")]
#          while org_response.first.size > 0 do
#            response << JSON.parse(org_response.to_json, object_class: OpenStruct)
#            page=page+1
#            puts "Getting next set from page #{page}  Org Counter: #{response.size}"
#            org_response = [HTTParty.get("http://aact-dev.herokuapp.com/api/v1/studies?organization=#{value.gsub(" ", "+")}&per_page=50&page=#{page}")]
#          end
#          response.flatten.uniq.each{|study|
#            study.prime_address= ''
#            study.reviews = Review.where('nct_id = ?',study['nct_id'])
#            study.reveiws = [] if study.reviews.nil?
#            study.average_rating = (study.reviews.size == 0 ? 0 : study.reviews.average(:rating).round(2))
#            col << study
#          }
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
