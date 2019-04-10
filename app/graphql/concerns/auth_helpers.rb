module AuthHelpers
  def current_user(context = self.context)
    context[:current_user]
  end
end
