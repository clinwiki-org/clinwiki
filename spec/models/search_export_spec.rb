# frozen_string_literal: true

describe SearchExport, type: :model do
  let(:user) { FactoryBot.create :user }
  let(:short_link) { FactoryBot.create :short_link }
  let(:site_view) { FactoryBot.create :site_view }

  let(:export) { described_class.create(short_link: short_link, user: user, site_view: site_view) }

  describe "#params" do
    subject { export.params }
    it { is_expected.to eql(JSON.parse(short_link.long).deep_symbolize_keys!) }
  end

  describe "#fields" do
    before do
      allow(site_view).to receive(:crowd_agg_names).and_return([])
    end

    subject { export.fields }
    it { is_expected.to eql(site_view.view[:search][:fields]) }
  end

  describe "#to_filename" do
    before do
      travel_to "2020-01-01"
    end
    subject { export.to_filename }
    it { is_expected.to eql("clinwiki-export-#{export.id}-2020-01-01.csv") }
    after { travel_back }
  end

  describe "#download_url" do
    subject { export.download_url }
    describe "if the object does not exist" do
      before { allow_any_instance_of(Aws::S3::Object).to receive(:exists?).and_return(false) }
      it { is_expected.to be_nil }
    end
    describe "if the object does exist" do
      before do
        allow_any_instance_of(Aws::S3::Object).to receive(:exists?).and_return(true)
        allow_any_instance_of(Aws::S3::Object).to receive(:presigned_url).with(:get).and_return("some-csv-url")
      end
      it { is_expected.to eql("some-csv-url") }
    end
  end

  describe "#upload_to_s3" do
    let(:file) { double(File) }
    it "should upload the file to aws" do
      allow(file).to receive(:read).and_return("some csv data")
      expect_any_instance_of(Aws::S3::Object).to receive(:put).with(
        body: "some csv data", content_type: "application/csv;charset=utf-8",
      )
      allow_any_instance_of(Aws::S3::Object).to receive(:public_url).and_return("some-public-url")
      expect { export.upload_to_s3(file) }.to change { export.reload.s3_url }.to("some-public-url")
    end
  end

  describe "self.create_and_process!" do
    it "should return the new export and trigger the job" do
      expect(CsvExportJob).to receive(:perform_async).with("search_export_id" => (SearchExport.last&.id || 0) + 1)
      expect {
        expect(described_class.create_and_process!(user: user, site_view: site_view, short_link: short_link)).to be_a(SearchExport)
      }.to change { SearchExport.count }.by(1)
    end
  end
end
