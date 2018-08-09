class SearchParams < Hash
  include Hashie::Extensions::MergeInitializer
  include Hashie::Extensions::IndifferentAccess
end

class SearchService
  include SearchHelper

  attr_accessor :params, :ctx
  def initialize(params, ctx)
    self.params = SearchParams.new(params)
    self.ctx = ctx
  end

  def current_user
    ctx.fetch(:current_user, nil)
  end
end
