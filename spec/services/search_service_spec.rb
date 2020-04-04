# frozen_string_literal: true

describe SearchService do
  describe "#search" do
    subject { described_class.new(params).search }

    let(:params) { { q: { "children" => [{ "children" => [], "key" => "foo" }], "key" => "AND" } } }

    it "sends a request to elasticsearch" do
      stub_request(:get, "#{Clinwiki::Application.config.es_url}/studies_test/_search")
        .with(
          body: hash_including({
            "query" => {
              "bool" => {
                "must" => [{ "query_string": { "query" => "(foo)" } }],
                "filter" => [{ "bool" => { "must" => [] } }]
              }
            }
          }),
        )
        .to_return(
          status: 200,
          body: file_fixture("search_service/default_response.json"),
          headers: { "Content-Type" => "application/json" },
        )
      subject
      expect(JSON.pretty_generate(JSON.parse(webmock_requests.last.body))).to match_snapshot("default_query")
    end

    describe "using the AST" do
      let(:params) {
        {
          q: {
            "children" => [
              {
                "children" => [
                  { "key" => "or", "children" => [
                    { "key": "baz", "children" => [] },
                    { "key": "qux", "children" => [] },
                  ] }, {
                    "children" => [{
                      "key" => "or",
                      "children" => [{ "key": "zoom", "children" => [] }, { "key": "zag" }],
                    }],
                    "key" => "and",
                  }
                ],
                "key" => "AND",
              },
            ],
            "key" => "and",
          },
        }
      }

      it "knows how to build a query from the AST" do
        stub_request(:get, "#{Clinwiki::Application.config.es_url}/studies_test/_search")
          .with(
            body: hash_including({
              "query" => {
                "bool" =>
                  { "must" =>
                    [{ "query_string": {
                        "query" => "(((baz) OR (qux)) AND (((zoom) OR (zag))))",
                      }
                    }],
                    "filter" => [{ "bool" => { "must" => [] } }]
                  }
                }
            }),
          )
          .to_return(
            status: 200,
            body: file_fixture("search_service/default_response.json"),
            headers: { "Content-Type" => "application/json" },
          )
        subject
        expect(JSON.pretty_generate(JSON.parse(webmock_requests.last.body))).to match_snapshot("ast_query")
      end
    end

    describe "filtering" do
      describe "scalar agg filters" do
        let(:params) {
          {
            q: { "key" => "foo", "children" => [] },
            agg_filters: [{ field: "browse_condition_mesh_terms", values: ["Foo", "Bar"] }],
          }
        }

        it "filters by ags" do
          stub_request(:get, "#{Clinwiki::Application.config.es_url}/studies_test/_search")
            .to_return(
              status: 200,
              body: file_fixture("search_service/default_response.json"),
              headers: { "Content-Type" => "application/json" },
            )
          subject
          expect(JSON.pretty_generate(JSON.parse(webmock_requests.last.body))).to match_snapshot("scalar_agg_filter_query")
        end
      end

      describe "range agg filters" do
        let(:params) {
          {
            q: { "key" => "foo", "children" => [] },
            agg_filters: [{ field: "start_date", gte: Date.new(2010, 1, 1), lte: Date.new(2020, 1, 1) }],
          }
        }

        it "filters by aggs" do
          stub_request(:get, "#{Clinwiki::Application.config.es_url}/studies_test/_search")
            .to_return(
              status: 200,
              body: file_fixture("search_service/default_response.json"),
              headers: { "Content-Type" => "application/json" },
            )
          subject
          expect(JSON.pretty_generate(JSON.parse(webmock_requests.last.body))).to match_snapshot("range_agg_filter_query")
        end
      end

      describe "searching with nested agg filter" do
        let(:params) {
          {
            q: { "key" => "foo", "children" => [] },
            agg_filters: [{ field: "wiki_page_edit.email", values: ["foo@bar.com", "baz@qux.com"] }],
          }
        }
        it "filters by nested aggs" do
          stub_request(:get, "#{Clinwiki::Application.config.es_url}/studies_test/_search")
            .to_return(
              status: 200,
              body: file_fixture("search_service/default_response.json"),
              headers: { "Content-Type" => "application/json" },
            )
          subject
          expect(JSON.pretty_generate(JSON.parse(webmock_requests.last.body))).to match_snapshot("nested_agg_filter_query")
        end
      end

    end
  end

  describe "#nested_filter" do
    let(:params) { { q: { "key" => "foo", "children" => [] }, agg_filters: [] } }
    subject { SearchService.new(params).send(:nested_filter, key, filter) }
    context "for a non nested key" do
      let (:key) { "hello" }
      let (:filter) { { field: "hello", values: ["test"] } }

      it { is_expected.to be_nil }
    end
    context "for a nested key" do
      let (:key) { "hello.stuff" }
      let(:filter) { { field: "hello.stuff", values: ["stuff1", "stuff2"] } }

      it "should return a nested filter" do
        expect(subject.to_json).to eql({
          nested: {
            path: "hello",
            query: {
              bool: {
                should: [
                  { match: { "hello.stuff" => "stuff1" } },
                  { match: { "hello.stuff" => "stuff2" } }
                ]
              }
            }
          }
        }.to_json)
      end
    end
  end
end
