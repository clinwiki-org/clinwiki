module Mutations
    class DeleteSavedSearch < BaseMutation
    
        argument :id, Int, required: true
        argument :user_id, Int, required: false
        
        
        field :success, Boolean, null: true # should return success true when it deletes
        field :errors, [String], null: true
        field :saved_search, Types::SavedSearchType, null: true
          
          def resolve(id:, user_id: nil)
            user = user_id ? user_id : current_user.id

            saved_search = SavedSearch.find_by(id: id)
            return { success: false, errors: ["Saved Search not found"] } if saved_search.blank?

            if saved_search.destroy
              { sucess: true, errors: nil, saved_search: saved_search }
            else
              { success: false, errors: saved_search.errors.full_messages }
            end
          end
      end
    end

