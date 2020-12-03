module BulkUpdateHelper
  def bulk_create_or_update_wiki_page_for_study(bulk_params: [], user: nil)
    ActiveRecord::Base.logger = nil
    edits = []
    wiki_pages = []
    bulk_params.each do |params|
      study = params[:study]
      wiki_page = study.wiki_page || WikiPage.new(nct_id: study.nct_id)
      wiki_text = wiki_page.text
      wiki_page.front_matter = update_front_matter(wiki_page.front_matter, params)
      wiki_page.updater = user
      next unless wiki_page.text != wiki_text

      wiki_pages << wiki_page
      edits << { wiki_page: wiki_page, wiki_text: wiki_text, user: user }
    end

    ActiveRecord::Base.transaction do
      WikiPage.import wiki_pages, on_duplicate_key_update: { conflict_target: [:nct_id], columns: [:text] }
      GenerateEditsJob.perform_later edits
    end
    Study.enqueue_reindex_ids(bulk_params.map { |x| x[:study][:nct_id] })
  end

  def update_front_matter(front_matter, params)
    updated = front_matter
    if params.key?(:add_meta)
      params[:add_meta].each do |key, new_values|
        values = updated[key]&.split("|") || []
        values = (values + new_values).flatten.uniq
        updated[key] = values.join("|")
      end
    end

    if params.key?(:delete_meta)
      params[:delete_meta].each do |key, remove_values|
        values = updated[key]&.split("|") || []
        values = values.reject { |x| remove_values.include?(x) }
        if values.empty?
          updated.delete key
        else
          updated[key] = values.join "|"
        end
      end
    end
    updated
  end

  def build_bulk_params(studies, agg_state)
    studies_updated = {}
    bulk_params = []
    studies.each do |study|
      params = {
        study: study,
        add_meta: {},
        delete_meta: {},
      }
      studies_updated[study[:nct_id]] = []
      agg_state.each do |state|
        if state[:enable]
          values = params[:add_meta][state[:name]] || []
          values << state[:value]
          params[:add_meta][state[:name]] = values
        else
          values = params[:delete_meta][state[:name]] || []
          values << state[:value]
          params[:delete_meta][state[:name]] = values
        end
        studies_updated[study[:nct_id]].push(state.to_h)
      end
      bulk_params.push(params)
    end
    { studies_updated: studies_updated, bulk_params: bulk_params }
  end

  def build_undo_actions(studies_updated)
    studies_updated.map do |key, value|
      {
        "nct_id" => key,
        "state" => value.map do |s|
          {
            "name" => s[:name],
            "value" => s[:value],
            "enable" => !s[:enable],
          }
        end,
      }
    end
  end
end
