class ReindexesStudy < ActiveRecord::Base
  self.abstract_class = true
  after_save :reindex_study

  def reindex_study
    study&.enqueue_reindex_job
  end

  private

  def study
    return nil unless nct_id

    Study.find_by(nct_id: nct_id)
  end
end
