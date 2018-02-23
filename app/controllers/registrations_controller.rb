class RegistrationsController < Devise::RegistrationsController
  skip_before_filter :verify_authenticity_token

  clear_respond_to

  def update_resource(resource, sanitized)
    # working around devise sanitizers for now
    resource.update_without_password(
      first_name: params[:first_name],
      last_name: params[:last_name],
      default_query_string: params[:default_query_string],
      search_result_columns: params[:search_result_columns],
    )
  end

  respond_to :json
end
