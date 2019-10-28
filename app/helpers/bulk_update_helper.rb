module BulkUpdateHelper
  # bulk_params: [{
  #   study: Study,
  #   add_meta: {
  #     "color": ["red", "blue"]
  #   }
  #   delete_meta: {
  #     "color": ["green"]
  #   }
  # }]
  def bulk_create_or_update_wiki_page_for_study(bulk_params: [], user: nil)
    ActiveRecord::Base.logger = nil
    # start = Time.now
    edits = []
    wiki_pages = []
    bulk_params.each do |params|
      # start2 = Time.now
      study = params[:study]
      wiki_page = study.wiki_page || WikiPage.new(nct_id: study.nct_id)
      wiki_text = wiki_page.text
      # pp "TIME INITIALIZING #{Time.now - start2}"
      wiki_page.front_matter = update_front_matter(wiki_page.front_matter, params)
      wiki_page.updater = user

      next unless wiki_page.text != wiki_text

      # start3 = Time.now
      wiki_pages << wiki_page
      edits << generate_edit(wiki_page, wiki_text, user)
      # pp "TIME PUSHING #{Time.now - start3}"
      # finished = Time.now
      # pp "TIME #{study[:nct_id]} - #{finished - start2}"
    end

    ActiveRecord::Base.transaction do
      WikiPage.import wiki_pages, on_duplicate_key_update: { conflict_target: [:nct_id], columns: [:text] }
      WikiPageEdit.import edits
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
        updated[key] = values.join("|")
      end
    end
    updated
  end

  def generate_edit(wiki_page, wiki_text, user)
    # start = Time.now
    diff = Diffy::Diff.new(wiki_page.text, wiki_text)
    diff_s = diff.to_s
    diff_html = diff.to_s(:html_simple)
    # pp "generate_edit DIFF #{Time.now-start}"
    # start2 = Time.now
    wp = {
      user_id: user.id,
      wiki_page_id: wiki_page.id,
      diff: diff_s,
      diff_html: diff_html,
    }
    # pp "generate_edit NEW #{Time.now-start2}"
    # pp "generate_edit TOTAL #{Time.now-start}"
    wp
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
