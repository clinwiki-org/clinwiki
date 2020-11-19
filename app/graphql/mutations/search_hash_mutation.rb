# frozen_string_literal: true

module Mutations
  class SearchHashMutation < BaseMutation
    argument :params, Types::SearchInputType, required: true

    field :search_hash, Types::ShortLinkType, null: true

    def resolve(params:)
      remove_paging = params.to_h.except(:page,:page_size)
      { search_hash: ShortLink.from_long(remove_paging.deep_symbolize_keys) }
    end
  end
end
