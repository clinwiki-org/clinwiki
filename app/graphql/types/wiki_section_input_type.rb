module Types
  class WikiSectionInputType < Types::BaseInputObject
    description "A wiki section input"
    argument :name, String , required: true
    argument :content, String , required: true
  end
end
