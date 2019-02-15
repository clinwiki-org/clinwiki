class AactRecord < ActiveRecord::Base # rubocop:disable Rails/ApplicationRecord
  self.abstract_class = true
  establish_connection(ENV["AACT_DATABASE_URL"])
  after_initialize :readonly!
end
