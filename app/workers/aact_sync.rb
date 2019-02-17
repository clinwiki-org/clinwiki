class AactSync
  include Sidekiq::Worker

  def perform(opts = {})
    Study.enqueue_reindex_job_big(Study.where("updated_at > ?", opts.fetch("days_ago", 1).to_i.days.ago))
  end
end
