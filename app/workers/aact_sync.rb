class AactSync
  include Sidekiq::Worker

  def perform(opts = {})
    days_ago = opts.fetch("days_ago", 1).to_i
    return if days_ago == 0

    Study.enqueue_reindex_job_big(Study.where("updated_at > ?", days_ago.days.ago))
  end
end
