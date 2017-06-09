class ReindexesStudy < ActiveRecord::Base
  self.abstract_class = true
  after_save :reindex_study
  belongs_to :study, :foreign_key => 'nct_id'
  def reindex_study
    study.enqueue_reindex_job
  end
end
