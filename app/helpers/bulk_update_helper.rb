module BulkUpdateHelper
  def generate_edit(wiki_text, user)
    diff = Diffy::Diff.new(@wiki_page.text, wiki_text)
    WikiPageEdit.create(
      user: user,
      wiki_page: @wiki_page,
      diff: diff.to_s,
      diff_html: diff.to_s(:html_simple),
    )
  end

  def get_study!(params:)
    study = Study.find_by(nct_id: params[:study_id])
    return status 404 if study.nil?

    study
  end

  def create_or_update_wiki_page_for_study(params: {}, user: nil) # rubocop:disable Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity, Metrics/LineLength
    study = get_study!(params: params)
    @wiki_page = study.wiki_page || WikiPage.new(nct_id: study.nct_id)

    content = if params.key?(:wiki_text)
                params[:wiki_text]
              else
                @wiki_page.content
              end

    front_matter = if params.key?(:meta)
                     params[:meta]
                   else
                     @wiki_page.front_matter
                   end


    front_matter.delete(params[:delete_meta][:key]) if params.key?(:delete_meta)
    front_matter[params[:add_meta][:key]] = params[:add_meta][:value] if params.key?(:add_meta)


    @wiki_page.updater = user
    @wiki_page.front_matter = front_matter
    @wiki_page.content = content
    @wiki_page.save
  end
end
