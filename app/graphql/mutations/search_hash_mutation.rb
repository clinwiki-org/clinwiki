# frozen_string_literal: true

module Mutations
  class SearchHashMutation < BaseMutation
    argument :params, Types::SearchInputType, required: true

    field :search_hash, Types::ShortLinkType, null: true

    def resolve(params:)
      { search_hash: ShortLink.from_long(params.to_h.deep_symbolize_keys) }
    end
  end
end
