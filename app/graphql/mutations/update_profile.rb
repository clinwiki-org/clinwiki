module Mutations
  class UpdateProfile < BaseMutation
    field :user, Types::UserType, null: true
    field :errors, [String], null: true

    argument :first_name, String, required: false
    argument :last_name, String, required: false
    argument :default_query_string, String, required: false

    def resolve(attrs)
      user = current_user
      return { user: nil, errors: ["Unauthorized"] } if user.blank?

      user.attributes = attrs

      if user.save
        { user: user, errors: nil }
      else
        { user: nil, errors: user.errors.full_messages }
      end
    end
  end
end
