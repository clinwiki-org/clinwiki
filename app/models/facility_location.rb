class FacilityLocation < ApplicationRecord
  self.primary_keys = :name, :city, :state, :zip, :country
end
