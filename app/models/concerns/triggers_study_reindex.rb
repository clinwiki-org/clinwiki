module TriggersStudyReindex
  extend ActiveSupport::Concern

  included do
    after_save :reindex_study
  end

  def reindex_study
    return unless nct_id

    study = Study.find_by(nct_id: nct_id)
    study&.enqueue_reindex_job
  end
end
