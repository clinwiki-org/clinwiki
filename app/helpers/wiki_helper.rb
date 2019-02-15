module WikiHelper
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

  def combined_markdown(content, front_matter = {})
    front_matter_string = front_matter.empty? ? "---\n" : front_matter.to_yaml
    "#{front_matter_string}---\n#{content}"
  end

  # TODO: refactor and simplify
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

    @previous_content = content
    @previous_front_matter = front_matter

    front_matter.delete(params[:delete_meta][:key]) if params.key?(:delete_meta)
    front_matter[params[:add_meta][:key]] = params[:add_meta][:value] if params.key?(:add_meta)
    front_matter["tags"] = (front_matter.fetch("tags", []) + [params[:add_tag]]).flatten.uniq if params.key?(:add_tag)

    if params.key?(:remove_tag)
      front_matter["tags"] = front_matter.fetch("tags", []).reject { |x| [params[:remove_tag]].flatten.include?(x) }
    end

    wiki_text = combined_markdown(content, front_matter)

    @edit = generate_edit(wiki_text, user)
    @wiki_page.text = wiki_text
    @wiki_page.save
  end
end
