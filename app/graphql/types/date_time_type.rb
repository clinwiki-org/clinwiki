module Types
  class DateTimeType < Types::BaseScalar
    description "An ISO 8601-encoded datetime"

    # It's not compatible with Rails' default,
    # i.e. ActiveSupport::JSON::Encoder.time_precision (3 by default)
    DEFAULT_TIME_PRECISION = 0

    # @param value [DateTime]
    # @return [String]
    def self.coerce_result(value, _ctx)
      value&.to_datetime&.utc&.iso8601
    end

    # @param str_value [String]
    # @return [DateTime]
    def self.coerce_input(str_value, _ctx)
      DateTime.iso8601(str_value)
    rescue ArgumentError
      # Invalid input
      nil
    end
  end
end
