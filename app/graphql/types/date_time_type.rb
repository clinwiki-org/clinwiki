module Types
  class DateTimeType < Types::BaseScalar
    description "An ISO 8601-encoded datetime"

    # It's not compatible with Rails' default,
    # i.e. ActiveSupport::JSON::Encoder.time_precision (3 by default)
    DEFAULT_TIME_PRECISION = 0

    # @param value [DateTime]
    # @return [String]
    def self.coerce_result(value, _ctx)
      # Format as mm/dd/yyyy
      value&.to_datetime&.utc&.to_s(:month_day_year)
    end

    # @param str_value [String]
    # @return [DateTime]
    def self.coerce_input(str_value, _ctx)
      # Try parse mm/dd/yyyy first
      DateTime.strptime(date, Time::DATE_FORMATS[:month_day_year])
    rescue ArgumentError
      begin
        DateTime.parse(str_value)
      rescue ArgumentError
        # Invalid input
        nil
      end
    end
  end
end
