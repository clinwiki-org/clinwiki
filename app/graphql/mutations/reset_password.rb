module Mutations
  class ResetPassword < BaseMutation
    field :success, Boolean, null: false

    argument :email, String, required: true

    def resolve(email:)
      user = User.find_by(email: email.downcase)
      return { success: true } if user.blank?

      user.update(reset_token_url:context[:current_url])
      user.send_reset_password_instructions
      { success: true }
    end
  end
end
