module MutationHelpers

  def mutations
    updates.map do |update|
      mutation = update.clone.deep_symbolize_keys
      begin
        mutation[:payload] = JSON.parse(mutation[:payload], quirks_mode: true)
      rescue StandardError # rubocop:disable Lint/HandleExceptions
        # use payload as string if it's not a json
      end
      mutation
    end
  end
end
