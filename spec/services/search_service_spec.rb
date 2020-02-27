# frozen_string_literal: true

describe SearchService do
  describe "#search" do
    subject { described_class.new(params).search }

    let(:params) { { q: { "children" => [{ "children" => [], "key" => "foo" }], "key" => "AND" } } }

    it "sends a request to elasticsearch" do
      stub_get = stub_request(:get, "http://elastic:9200/studies_test/_search")
        .with(
          body: hash_including("query" => { "bool" => { "must" => { "query_string": { "query" => "(foo)" } }, "filter" => [{ "bool" => { "must" => [] } }] } }),
        )
        .to_return(
          status: 200,
          body: file_fixture("search_service/default_response.json"),
          headers: { "Content-Type" => "application/json" },
        )
      subject
      expect(webmock_requests[0].body).to match_snapshot("default_query")
    end

    describe "using the AST" do
      let(:params) { {
        q: {
          "children" => [
            {
              "children" => [
                {"key" => "or", "children" => [
                  {"key": "baz", "children" => []},
                  {"key": "qux", "children" => []}
                ]}, {
                  "children" => [{"key" => "or", "children" => [{"key": "zoom", "children" => []}, {"key": "zag"}]}],
                  "key" => "and"
                }
              ],
              "key" => "AND"
            }
          ],
          "key" => "and"
        }
      } }

      it "knows how to build a query from the AST" do
        stub_get = stub_request(:get, "http://elastic:9200/studies_test/_search")
          .with(
            body: hash_including("query" => { "bool" => { "must" => { "query_string": { "query" => "(((baz) OR (qux)) AND (((zoom) OR (zag))))" } }, "filter" => [{ "bool" => { "must" => [] } }] } }),
          )
          .to_return(
            status: 200,
            body: file_fixture("search_service/default_response.json"),
            headers: { "Content-Type" => "application/json" },
          )
        subject
        expect(webmock_requests[0].body).to match_snapshot("ast_query")
      end
    end
  end
end
