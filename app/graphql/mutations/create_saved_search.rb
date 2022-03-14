module Mutations
    class CreateSavedSearch < BaseMutation
    
        argument :user_id, Int, required: false
       # argument :name_label, Int, required: false    #* NOTE: could make this conditional if we assign the name on save search cretion in future
        argument :search_hash, String, required: true
        argument :url, String, required: true
        
        field :saved_search, Types::SavedSearchType, null: false
        field :errors, [String], null: false
          
          def resolve(search_hash:,  user_id: nil, url:)
            link = ShortLink.find_by short: search_hash
            #* NOTE: This can be useful on UpdateSavedSearchMutation. is_subscribed = params[:is_subscribed].present? ? params[:is_subscribed] : false
            #* NOTE: for future if we add name when creating/saving search. name_label = params[:name_label].present ? params[:name_label].present : build_name_label(link.long)
            name_label = build_name_label(JSON.parse link.long.gsub('=>', ':'))
            user = user_id ? user_id : current_user.id
            hash = { user_id: user, short_link_id: link.id, name_label: name_label, url: url }
            saved_search = SavedSearch.new(hash)
            if saved_search.save
              { saved_search: saved_search, errors: nil }
            else
              { saved_search: nil, errors: saved_search.errors.full_messages }
            end
          end


          def build_name_label(search_info)
            result = ""
            rDescription = ""
            lDescription = ""  #always radius    "xxx miles from" if no zipcode then "current location" else " this _zipcode_"
            if search_info["q"]["children"].present?
              search_term = search_info["q"]["children"][0]["key"].humanize
              result = result + "#{search_term} |"
            end
            if search_info["crowd_agg_filters"].present?
              search_info["crowd_agg_filters"].each do |filter|

                if filter["gte"].present? && filter["lte"].present?
                  rDescription =( "#{filter['field']} #{filter['gte']} - #{filter['lte']} |")
                  result = (result + rDescription)
                end
                if filter["gte"].present? && filter["lte"].blank?
                  rDescription = "#{filter['field']} ≥ #{filter['gte']} |"
                  result = (result + rDescription)
                end
                if filter["lte"].present? && filter["gte"].blank?
                  rDescription = "#{filter['field']} ≤ #{filter['lte']} |"
                  result = (result + rDescription)
                end

                if filter["radius"].present?
                  lDescription = "#{filter['radius']} miles from "
                  lDescription = filter["zipcode"].present? ?  (lDescription + "#{filter['zipcode']} |") : (lDescription + "current location |")
                  result = (result + lDescription)
                end
                filter["values"].each do |value|
                  crowd_agg = value.humanize
                  result = result + "#{crowd_agg} |"
                end
              end
            end
            if search_info["agg_filters"].present?
              search_info["agg_filters"].each do |filter|

                if filter["gte"].present? && filter["lte"].present?
                  rDescription =( "#{filter['field']} #{filter['gte']} - #{filter['lte']} |")
                  result = (result + rDescription)
                end
                if filter["gte"].present? && filter["lte"].blank?
                  rDescription = "#{filter['field']} ≥ #{filter['gte']} |"
                  result = (result + rDescription)
                end
                if filter["lte"].present? && filter["gte"].blank?
                  rDescription = "#{filter['field']} ≤ #{filter['lte']} |"
                  result = (result + rDescription)
                end

                if filter["radius"].present?
                  lDescription = "#{filter['radius']} miles from "
                  lDescription = filter["zipcode"].present? ?  (lDescription + "#{filter['zipcode']} |") : (lDescription + "current location |")
                  result = (result + lDescription)
                end
                filter["values"].each do |value|
                  agg = value.humanize
                  result = result + "#{agg} |"
                end
              end
              result.delete_suffix!('|')
            end
            result
          end

        end 
      end


