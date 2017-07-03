module WikiHelper

  def generate_edit
    diff = Diffy::Diff.new(@wiki_page.text, params[:wiki_text])
    WikiPageEdit.new(
      user: current_user,
      wiki_page: @wiki_page,
      diff: diff.to_s,
      diff_html: diff.to_s(:html_simple)
    )
  end

  def get_study!
    study = Study.find_by(nct_id: params[:study_id])
    if study.nil?
      return status 404
    end
    return study
  end

  def create_or_update_wiki_page_for_study
    study = get_study!
    @wiki_page = study.wiki_page || WikiPage.new(nct_id: study.nct_id)
    @edit = generate_edit
    @edit.save
    @wiki_page.text = params[:wiki_text]
    @wiki_page.save
  end

end
