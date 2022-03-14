module Types
  class SiteViewOperationType < Types::BaseEnum
    description "Possible set of operations of site view"

    value "SET", value: "set"
    value "PUSH", value: "push"
    value "DELETE", value: "delete"
  end
end
