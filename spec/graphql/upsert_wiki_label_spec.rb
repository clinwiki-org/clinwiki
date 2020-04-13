# frozen_string_literal: true

describe "upsertWikiLabel" do
  let(:study) { Study.order(Arel.sql("RANDOM()")).first }
  let(:query) { file_fixture("graphql/wiki_page_mutations/upsert_wiki_label.gql").read }
  let(:variables) { { nctId: study.nct_id, key: "some key", value: "some value" } }
  let(:context) { {} }

  subject { ClinwikiSchema.execute(query, variables: variables, context: context).to_h }

  describe "without a logged in user" do
    it { expect { subject }.not_to(change { WikiPage.count }) }
    it { expect { subject }.not_to(change { WikiPageEdit.count }) }
    it "should return nil" do
      expect(subject.dig("data", "upsertWikiLabel")).to be_nil
    end
  end

  describe "with a logged in user" do
    let!(:user) { create :user }
    let(:context) { { current_user: user } }
    describe "if the wiki page already exists" do
      let!(:wiki_page) { create :wiki_page, study: study }
      describe "if a value is already set for the crowd data" do
        before do
          fm = wiki_page.front_matter
          fm["some key"] = "some other value"
          wiki_page.front_matter = fm
          wiki_page.save
        end
        it { expect(subject.dig("errors")).to be_nil }
        it { expect { subject }.not_to(change { WikiPage.count }) }
        it { expect { subject }.to(change { WikiPageEdit.count }) }
        it "should change the front matter value" do
          subject
          expect(wiki_page.reload.front_matter["some key"]).to eql("some value")
          expect(subject.dig(
                   "data", "upsertWikiLabel", "wikiPage", "edits", 0, "changeSet", "frontMatterChanged"
                 )).to be_truthy
          expect(subject.dig(
                   "data", "upsertWikiLabel", "wikiPage", "edits", 0, "changeSet", "bodyChanged"
                 )).to be_falsey
        end
      end
    end

    describe "if the wiki page is new" do
      it { expect { subject }.to(change { WikiPage.count }) }
      it { expect { subject }.to(change { WikiPageEdit.count }) }
      it "should set the front matter value" do
        subject
        expect(WikiPage.last.front_matter["some key"]).to eql("some value")
        expect(subject.dig(
                 "data", "upsertWikiLabel", "wikiPage", "edits", 0, "changeSet", "frontMatterChanged"
               )).to be_truthy
        expect(subject.dig(
                 "data", "upsertWikiLabel", "wikiPage", "edits", 0, "changeSet", "bodyChanged"
               )).to be_truthy
      end
      it "does not modify the content of the wiki page" do
        subject
        expect(WikiPage.last.content).to eql(WikiPage.new(study: study).default_content)
      end
    end
  end
end
