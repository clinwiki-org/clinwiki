# frozen_string_literal: true

describe "Search Export GraphQL" do
  subject { ClinwikiSchema.execute(query, variables: variables, context: context).to_h }
  let(:context) { {} }
  let(:variables) { {} }

  describe "exporting to CSV" do
    let(:query) { file_fixture("graphql/search_export/export_to_csv.gql").read }
    let(:user) { FactoryBot.create :user }
    let(:site_view) { FactoryBot.create :site_view }
    let(:short_link) { FactoryBot.create :short_link }

    shared_examples "it returns nil" do
      it { expect(subject.dig("data", "exportToCsv", "searchExport")).to be_nil }
    end

    describe "without a user" do
      it_behaves_like "it returns nil"
    end

    describe "with a user" do
      let(:context) { { current_user: user } }
      describe "without a search hash" do
        it_behaves_like "it returns nil"
      end

      describe "with a search hash" do
        let(:variables) { { "searchHash" => short_link.short } }
        describe "without a site view id" do
          it_behaves_like "it returns nil"
        end

        describe "with a site view id" do
          let(:variables) { { "searchHash" => short_link.short, "siteViewId" => site_view.id } }

          it "should create the export and trigger the export job" do
            expect(CsvExportJob).to receive(:perform_async)
            expect { subject }.to change { SearchExport.count }.by(1)
            expect(subject.dig("data", "exportToCsv", "searchExport")).not_to be_nil
            expect(subject.dig("data", "exportToCsv", "searchExport", "shortLink", "short")).to eql(short_link.short)
            expect(subject.dig("data", "exportToCsv", "searchExport", "user", "id")).to eql(user.id)
          end
        end
      end
    end
  end

  describe "retrieving the export" do
    let(:user) { FactoryBot.create :user }
    let(:export) { FactoryBot.create :search_export, user: user }
    let(:query) { file_fixture("graphql/search_export/search_export.gql").read }
    let(:variables) { { "searchExportId" => export.id } }

    describe "if the user cant access the export" do
      let(:context) { { current_user: FactoryBot.create(:user) } }
      it "should not return the export" do
        expect(subject.dig("data", "searchExport")).to be_nil
      end
    end

    describe "if the user can access the export" do
      let(:context) { { current_user: user } }

      describe "if the export is not ready" do
        before { expect_any_instance_of(Aws::S3::Object).to receive(:exists?).and_return(false) }
        it "should have a nil download url" do
          expect_any_instance_of(Aws::S3::Object).not_to receive(:presigned_url)
          expect(subject.dig("data", "searchExport", "downloadUrl")).to be_nil
        end
      end

      describe "if the export is ready" do
        before do
          expect_any_instance_of(Aws::S3::Object).to receive(:exists?).and_return(true)
          expect_any_instance_of(Aws::S3::Object).to receive(:presigned_url).with(:get).and_return("some-presigned-url")
        end
        it "should expose the download url" do
          expect(subject.dig("data", "searchExport", "downloadUrl")).to eql("some-presigned-url")
        end
      end
    end
  end
end
