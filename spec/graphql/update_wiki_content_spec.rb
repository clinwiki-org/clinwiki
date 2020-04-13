# frozen_string_literal: true

describe "updateWikiContent" do
  let(:study) { Study.order(Arel.sql("RANDOM()")).first }
  let(:query) { file_fixture("graphql/wiki_page_mutations/update_wiki_content.gql").read }
  let(:variables) { { nctId: study.nct_id, content: "here is some more wiki content" } }
  let(:context) { {} }

  subject { ClinwikiSchema.execute(query, variables: variables, context: context).to_h }

  describe "without a logged in user" do
    it { expect { subject }.not_to(change { WikiPage.count }) }
    it { expect { subject }.not_to(change { WikiPageEdit.count }) }
    it "should return nil" do
      expect(subject.dig("data", "updateWikiContent")).to be_nil
    end
  end

  describe "with a logged in user" do
    let!(:user) { create :user }
    let(:context) { { current_user: user } }
    describe "if the wiki page already exists" do
      let!(:wiki_page) { create :wiki_page, study: study }

      before do
        fm = wiki_page.front_matter
        fm["foo"] = "bar"
        wiki_page.front_matter = fm
        wiki_page.save
      end

      it "should not return an error" do
        expect(subject.dig("data", "updateWikiContent", "errors")).to be_nil
      end

      it { expect { subject }.to(change { WikiPage.find(wiki_page.id).content }) }
      it { expect { subject }.not_to(change { wiki_page.reload.front_matter }) }
      it { expect { subject }.not_to(change { WikiPage.count }) }
      it { expect { subject }.to(change { WikiPageEdit.count }) }

      it "updates the body, and not the front matter" do
        expect(subject.dig("data", "updateWikiContent", "wikiPage", "edits", 0, "changeSet", "frontMatterChanged")).to be_falsey
        expect(subject.dig("data", "updateWikiContent", "wikiPage", "edits", 0, "changeSet", "bodyChanged")).to be_truthy
      end
    end

    describe "if the wiki page is new" do
      it { expect { subject }.to(change { WikiPageEdit.count }) }
      it { expect { subject }.to(change { WikiPage.count }) }
      it "should create a wiki page with the correct content" do
        subject
        expect(WikiPage.last.content).to eql "here is some more wiki content"
        expect(subject.dig("data", "updateWikiContent", "wikiPage", "edits", 0, "changeSet", "frontMatterChanged")).to be_truthy
        expect(subject.dig("data", "updateWikiContent", "wikiPage", "edits", 0, "changeSet", "bodyChanged")).to be_truthy
      end
      it "doesn't modify front matter, just initializes it" do
        subject
        expect(WikiPage.last.front_matter).to be_empty
      end
    end
  end
end
