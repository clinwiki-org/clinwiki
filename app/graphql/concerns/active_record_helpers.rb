MAX_RETRIES = 5
RETRY_LAG_MS = 100

module ActiveRecordHelpers
  def serializable(retries = MAX_RETRIES)
    ActiveRecord::Base.transaction(isolation: :serializable) do
      yield
    end
  rescue ActiveRecord::SerializationFailure
    if retries > 0
      sleep(rand * RETRY_LAG_MS / 1000)
      serializable(retries - 1, &Proc.new)
    else
      Rails.logger.error("No retries left for serializable transactions")
    end
  end
end
