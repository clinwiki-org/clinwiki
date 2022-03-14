class ProcessQueueJob < Searchkick::ProcessQueueJob
  def perform(opts)
    Searchkick::ProcessQueueJob.perform_later(class_name: opts["class_name"])
  end
end
