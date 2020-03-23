# frozen_string_literal: true

describe "search queries" do
  let(:query) { file_fixture("graphql/search/basic_search.gql").read }
  let(:variables) { {} }
  let(:context) { {} }

  subject { ClinwikiSchema.execute(query, variables: variables, context: context).to_h }

  shared_examples "it properly maps data from query to es and back" do |slug|
    before do
      stub_request(:get, "http://elastic:9200/studies_test/_search")
        .to_return(
          status: 200,
          body: file_fixture("graphql/search/#{slug}_response.json").read,
          headers: { "Content-Type" => "application/json" },
        )
    end

    it "does not raise an error" do
      expect(subject.fetch("errors", [])).to be_empty
    end

    it "prepares the proper query for elasticsearch" do
      subject
      expect(webmock_requests[0].body).to match_snapshot("#{slug}_query")
    end

    it "returns the proper response for the graphql server" do
      expect(subject).to match_snapshot("#{slug}_graphql_response")
    end
  end

  describe "a basic search" do
    let(:variables) { { input: { q: { key: "stomach" } } } }

    it_behaves_like "it properly maps data from query to es and back", "basic_search"
  end

  describe "agg filters" do
    context "scalar values" do
      let(:variables) { { input: {
        q: { key: "stomach" },
        aggFilters: [{ field: "phase", values: ["Phase 1", "Phase 2"] }]
      } } }
      it_behaves_like "it properly maps data from query to es and back", "basic_agg_filter_search"
    end

    context "ranged values" do
      context "with a date scalar" do
        let(:variables) { { input: {
          q: { key: "stomach" },
          aggFilters: [{ field: "start_date", gte: "2010-01-01"}]
        } } }
        it_behaves_like "it properly maps data from query to es and back", "range_filter_search"
      end
    end

  end
end
