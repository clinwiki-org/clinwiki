module ReindexStudyHelper
  # Model helper for triggering reindex of study

  after_create :reindex_study

  def reindex_study
    this.study.reindex_async
  end
end
