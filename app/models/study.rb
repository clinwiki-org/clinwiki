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

    def display_start_date
      start_date.to_date.strftime('%B %Y') if start_date
    end

    def display_primary_completion_date
      primary_completion_date.to_date.strftime('%B %Y') if primary_completion_date
    end

	end
