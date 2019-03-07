require "rails_helper"

RSpec.describe HashGenerator do
  let(:subject) { HashGenerator.new }
  describe "#serialize" do
    it "serializes to json with hashes sorted by keys" do
      data = {
        c: "John Doe",
        d: 123,
        b: nil,
        a: [3, 2, { d: 10, c: 1 }, nil, "String"],
      }
      actual_data = subject.serialize(data)
      expected_data = '{"a":[3,2,{"c":1,"d":10},null,"String"],"b":null,"c":"John Doe","d":123}'

      expect(actual_data).to eq(expected_data)

      expect(JSON.parse(actual_data).deep_symbolize_keys).to eq(data)
    end

    it "serializes nil to null" do
      data = nil
      actual_data = subject.serialize(data)
      expected_data = "null"

      expect(actual_data).to eq(expected_data)
    end

    it "serializes empty array to []" do
      data = []
      actual_data = subject.serialize(data)
      expected_data = "[]"

      expect(actual_data).to eq(expected_data)

      expect(JSON.parse(actual_data)).to eq(data)
    end

    it "serializes empty object to {}" do
      data = {}
      actual_data = subject.serialize(data)
      expected_data = "{}"

      expect(actual_data).to eq(expected_data)

      expect(JSON.parse(actual_data)).to eq(data)
    end
  end
end
