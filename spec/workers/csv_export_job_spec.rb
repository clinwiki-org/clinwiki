# frozen_string_literal: true

describe CsvExportJob do
  let(:site_view) { FactoryBot.create :site_view }
  let(:export) { FactoryBot.create :search_export, site_view: site_view }

  subject { described_class.new.perform(params) }

  describe "without the export id" do
    let(:params) { {} }
    it { expect { subject }.to raise_error }
  end

  describe "if the export id is malformed" do
    let(:params) { { "search_export_id" => -9 } }
    it { expect { subject }.to raise_error }
  end

  describe "with a well formed export id" do
    let(:tempfile) { double(Tempfile) }
    let(:csv) { double(CSV) }
    let(:params) { { "search_export_id" => export.id } }
    let(:hits) { 5.times.map { FactoryBot.build :search_result } }

    let!(:search_request) {
      stub_request(:get, "#{Clinwiki::Application.config.es_url}/studies_test/_search?scroll=1m")
        .with(body: "{\"query\":{\"bool\":{\"must\":{\"query_string\":{\"query\":\"*\"}},\"filter\":[{\"bool\":{\"must\":[]}}]}},\"sort\":[{\"nct_id\":\"asc\"}],\"timeout\":\"11s\",\"size\":10000}")
        .to_return(status: 200, body: {
          _scroll_id: "DnF1ZXJ5VGhlbk",
          hits: {
            total: 5,
            hits: hits,
          },
        }.to_json, headers: { "Content-type": "application/json" })
    }

    let!(:scroll_request) {
      stub_request(:get, "#{Clinwiki::Application.config.es_url}/_search/scroll/DnF1ZXJ5VGhlbk?scroll=1m")
        .to_return(status: 200, body: {
          _scroll_id: "DnF1ZXJ5VGhlbk",
          hits: {
            total: 5,
            hits: [],
          },
        }.to_json, headers: { "Content-type": "application/json" })
    }

    let!(:scroll_clear_request) {
      stub_request(:delete, "#{Clinwiki::Application.config.es_url}/_search/scroll/DnF1ZXJ5VGhlbk")
        .to_return(status: 200, body: nil)
    }

    before do
      allow(Tempfile).to receive(:new).and_return(tempfile)
      allow(CSV).to receive(:new).with(tempfile).and_return(csv)
      allow_any_instance_of(SiteView).to receive(:crowd_agg_names).and_return([])
      allow_any_instance_of(SearchService).to receive(:agg_buckets_for_field).and_return({})
    end

    it "should write the header and some fields to the csv" do
      expect(csv).to receive(:<<).with(export.fields).ordered
      hits.each do |hit|
        expect(csv).to receive(:<<).with(JSON.parse(hit.to_json).slice(*export.fields).values).ordered
      end
      expect(tempfile).to receive(:rewind)
      expect_any_instance_of(SearchExport).to receive(:upload_to_s3).with(tempfile)
      subject
      expect(search_request).to have_been_requested
      expect(scroll_request).to have_been_requested
      expect(scroll_clear_request).to have_been_requested
    end

    describe "if the site view defines a different set of visible fields" do
      let(:custom_fields) { %w[nct_id start_date sponsor why_stopped] }

      before :each do
        # the way site views present their view is absurd, so we will stub that logic instead
        allow_any_instance_of(SearchExport).to receive(:fields).and_return(custom_fields)
      end

      it "should use those specified fields" do
        export.site_view.view[:search][:fields] =
          export.site_view.save!
        expect(csv).to receive(:<<).with(custom_fields).ordered
        hits.each do |hit|
          expect(csv).to receive(:<<).with(JSON.parse(hit.to_json).slice(*custom_fields).values).ordered
        end
        expect(tempfile).to receive(:rewind)
        expect_any_instance_of(SearchExport).to receive(:upload_to_s3).with(tempfile)
        subject
        expect(search_request).to have_been_requested
        expect(scroll_request).to have_been_requested
        expect(scroll_clear_request).to have_been_requested
      end
    end
  end
end
