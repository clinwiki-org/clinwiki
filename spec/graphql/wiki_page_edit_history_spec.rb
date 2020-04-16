# frozen_string_literal: true

describe "Wiki Page Edit History" do
  let(:user) { FactoryBot.create :user }
  let(:study) { Study.order(Arel.sql("RANDOM()")).first }
  let!(:wiki_page) { FactoryBot.create :wiki_page, study: study }

  let(:query) { file_fixture("graphql/wiki_page_edit_history/get_history.gql").read }
  let(:variables) { { nctId: study.nct_id } }
  let(:context) { {} }

  let(:edits) { subject.dig("data", "study", "wikiPage", "edits") }

  subject { ClinwikiSchema.execute(query, variables: variables, context: context).to_h }

  before do
    wiki_page.updater = user
    wiki_page.content = wiki_page.content.sub("Add a pro here", "Here is a pro")
    wiki_page.save
    wiki_page.text = wiki_page.text.sub("Add a con here", "Here is a con")
    wiki_page.save
    wiki_page.front_matter = { "foo" => "bar" }
    wiki_page.save
    wiki_page.front_matter = { "foo" => "baz" }
    wiki_page.save
  end

  it "shows the initial wiki page creation as neither changed" do
    expect(edits.last["changeSet"]["bodyChanged"]).to eql false
    expect(edits.last["changeSet"]["frontMatterChanged"]).to eql false
  end

  it "shows changes to content as only content changed" do
    expect(edits[2]["changeSet"]["bodyChanged"]).to eql true
    expect(edits[2]["changeSet"]["frontMatterChanged"]).to eql false
    expect(edits[2]["changeSet"]["editLines"].find { |x| x["status"] == "DEL" && x["content"] == "* Add a con here" }).not_to be_nil
    expect(edits[2]["changeSet"]["editLines"].find { |x| x["status"] == "INS" && x["content"] == "* Here is a con" }).not_to be_nil
  end

  it "shows front matter changes as changes only to front matter" do
    expect(edits[1]["changeSet"]["bodyChanged"]).to eql false
    expect(edits[1]["changeSet"]["frontMatterChanged"]).to eql true
    expect(edits[1]["changeSet"]["editLines"].slice(0, 3).map { |x| x["status"] }).to eql(%w[UNCHANGED INS UNCHANGED])
  end
end
