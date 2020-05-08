module Mutations
  class UpdatePassword < BaseMutation
    field :user, Types::UserType, null: false
    field :errors, String, null:false

    argument :reset_password_token, String, required: true
    argument :password, String, required: true
    argument :password_confirmation, String, required: true

    def resolve(attrs)
      user = User.reset_password_by_token(attrs)
      {
        user: user,
        errors: user.errors.full_messages
      }
    end
  end
end
