class ShortLink < ApplicationRecord
  has_many :search_logs
  class << self
    MAX_HASH_RETRIES = 5

    # Returns ShortLink by either finding an existing entity
    # (in that case it updates `updated_at`)
    # Or creating a new one if it doens't exist yet.
    # In case of hash collision it make double, triple, etc. hash
    # up to MAX_HASH_RETRIES
    #
    # @param [String] long - the unhashed data stored in `long` field
    #
    # @return [ShortLink] or raises ActiveRecord::RecordNotSaved in case it cannot find free hash
    def from_long(hashmap)
      long = hash_generator.serialize(hashmap)
      link = find_by(long: long)
      if link
        link.touch
        return link
      end

      create_link(long)
    end

    # In addition to finding the link it also updates `updated_at` timestamp
    def from_short(short)
      link = find_by(short: short)
      return nil if link.nil?

      link.touch
      link
    end

    private

    def create_link(data, data_to_hash = nil, max_retries = MAX_HASH_RETRIES)
      if max_retries == -1
        raise ActiveRecord::RecordNotSaved(
          "Tried to hash data, but #{MAX_HASH_RETRIES} retries limit was exceeded",
          new(long: data),
        )
      end
      hash = hash_generator.hash(data_to_hash || data)

      begin
        create(short: hash, long: data)
      rescue ActiveRecord::RecordNotUnique
        return allocate_hash(data, hash, max_retries - 1)
      end
    end

    def hash_generator
      @hash_generator ||= HashGenerator.new
    end
  end
end
