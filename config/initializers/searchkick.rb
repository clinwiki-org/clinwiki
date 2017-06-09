ENV['ELASTICSEARCH_URL'] = ENV['SEARCHBOX_URL']
Searchkick.redis = Redis.new
ActiveJob::TrafficControl.client = Searchkick.redis

class Searchkick::BulkReindexJob
  concurrency 8
end

module Searchkick
  class Index
    # monkey-patch full_reindex_async because of bad primary key assumptions
    def full_reindex_async(scope)
      batch_id = 1
      # TODO remove any eager loading
      scope = scope.only(:_id) if scope.respond_to?(:only)
      each_batch(scope) do |items|
        bulk_reindex_job scope, batch_id, record_ids: items.map { |i| i.id.to_s }
        batch_id += 1
      end
    end
  end
end
