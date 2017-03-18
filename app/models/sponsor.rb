class Sponsor < Aact
  scope :named, lambda {|agency| where("name LIKE ?", "#{agency}%" )}
end
