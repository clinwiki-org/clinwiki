class AactBase < ActiveRecord::Base
  establish_connection(ENV["AACT_DATABASE_URL"])
  # establish_connection(DB_AACT)
  after_initialize :readonly!
  self.abstract_class = true
end
