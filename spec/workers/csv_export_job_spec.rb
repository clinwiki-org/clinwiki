# frozen_string_literal: true

describe CsvExportJob do
  let(:export) { FactoryBot.create :search_export }

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
    let(:hits) { 5.times.map{ FactoryBot.build :search_result } }

    before do
      allow(Tempfile).to receive(:new).and_return(tempfile)
      allow(CSV).to receive(:new).with(tempfile).and_return(csv)
      allow_any_instance_of(SiteView).to receive(:crowd_agg_names).and_return([])

      stub_request(:get, "http://#{Clinwiki::Application.config.es_url}/studies_test/_search")
        .with(
          body: "{\"aggs\":{\"front_matter_keys\":{\"filter\":{\"bool\":{\"must\":[{\"bool\":{\"must\":[]}}]}},\"aggs\":{\"front_matter_keys\":{\"terms\":{\"field\":\"front_matter_keys\",\"size\":1000000,\"order\":{\"_term\":\"asc\"},\"missing\":\"-99999999999\"},\"aggs\":{\"agg_bucket_sort\":{\"bucket_sort\":{\"from\":0,\"size\":25,\"sort\":[]}}}}}}},\"query\":{\"bool\":{\"must\":{\"query_string\":{\"query\":\"*\"}},\"filter\":[{\"bool\":{\"must\":[]}}]}},\"sort\":[{\"nct_id\":\"asc\"}],\"timeout\":\"11s\",\"size\":0}",
          headers: {
            "Accept" => "*/*",
            "Accept-Encoding" => "gzip;q=1.0,deflate;q=0.6,identity;q=0.3",
            "Content-Type" => "application/json",
            "User-Agent" => "elasticsearch-ruby/7.5.0 (RUBY_VERSION: 2.5.3; darwin x86_64; Faraday v0.15.4)",
          },
        )
        .to_return(status: 200, body: {
          _scroll_id: "DnF1ZXJ5VGhlbk",
          hits: {
            total: 5,
            hits: hits,
          },
        }.to_json, headers: { "Content-type": "application/json" })
    end

    it "should write the header and some fields to the csv" do
      expect(csv).to receive(:<<).with(export.fields)
      subject
    end
  end
end
