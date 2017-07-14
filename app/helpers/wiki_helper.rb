module WikiHelper

  def generate_edit(wiki_text)
    diff = Diffy::Diff.new(@wiki_page.text, wiki_text)
    WikiPageEdit.create(
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

  def combined_markdown(content, front_matter={})
    front_matter_string = front_matter.empty? ? "---\n" : front_matter.to_yaml
    "#{front_matter_string}---\n#{content}"
  end

  def create_or_update_wiki_page_for_study
    study = get_study!
    @wiki_page = study.wiki_page || WikiPage.new(nct_id: study.nct_id)

    content = if params.has_key?(:wiki_text)
                params[:wiki_text]
              else
                @wiki_page.content
              end

    front_matter = if params.has_key?(:meta)
                    params[:meta]
                   else
                     @wiki_page.front_matter
                   end


    if params.has_key?(:delete_meta)
      front_matter.delete(params[:delete_meta][:key])
    end

    if params.has_key?(:add_meta)
      front_matter[params[:add_meta][:key]] = params[:add_meta][:value]
    end

    if params.has_key?(:add_tag)
      front_matter["tags"] = front_matter.fetch("tags", []) + [params[:add_tag]]
    end

    if params.has_key?(:remove_tag)
      front_matter["tags"] = front_matter.fetch("tags", []).select{|x| x != params[:remove_tag]}
    end

    wiki_text = combined_markdown(content, front_matter)

    @edit = generate_edit(wiki_text)
    @wiki_page.text = wiki_text
    @wiki_page.save
  end

end
