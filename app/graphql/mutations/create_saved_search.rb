module Mutations
    class CreateSavedSearch < BaseMutation
    
        argument :user_id, Int, required: false
       # argument :name_label, Int, required: false    #* NOTE: could make this conditional if we assign the name on save search cretion in future
        argument :search_hash, String, required: true
        
        field :saved_search, Types::SavedSearchType, null: false
        field :errors, [String], null: false
          
          def resolve(search_hash:, user_id: nil)
            link = ShortLink.find_by short: search_hash
            #* NOTE: This can be useful on UpdateSavedSearchMutation. is_subscribed = params[:is_subscribed].present? ? params[:is_subscribed] : false
            #* NOTE: for future if we add name when creating/saving search. name_label = params[:name_label].present ? params[:name_label].present : build_name_label(link.long)
            name_label = build_name_label(JSON.parse link.long.gsub('=>', ':'))
            user = user_id ? user_id : current_user.id
            hash = { user_id: user, short_link_id: link.id, name_label: name_label }
            saved_search = SavedSearch.new(hash)
            if saved_search.save
              { saved_search: saved_search, errors: nil }
            else
              { saved_search: nil, errors: saved_search.errors.full_messages }
            end
          end

          def build_name_label(search_info)
            entries = 0 
            result = ""
            if search_info["q"]["children"].present?
              search_term = search_info["q"]["children"][0]["key"].humanize
              result = result + "#{search_term}|"
              entries = entries + 1 
            end 
            if search_info["agg_filters"].present?
              search_info["agg_filters"].each do |filter|
                filter["values"].each do |value|
                  agg = value.humanize
                  result = result + "#{agg}|" if entries <= 4 
                  entries = entries + 1 
                end 
              end 
            end 
            result.delete_suffix!('|')
          end
        end 
      end


