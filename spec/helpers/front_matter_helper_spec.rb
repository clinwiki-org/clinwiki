# frozen_string_literal: true

describe FrontMatterHelper do

  let(:helper) { Class.new do; include FrontMatterHelper; end.new }

  describe "#cast" do

    it "splits pipe-separated strings" do
      expect(helper.cast("a")).to eql(["a"])
      expect(helper.cast("a|b")).to eql(["a", "b"])
    end

    it "identifies integers" do
      expect(helper.cast("1")).to eql(1)
    end

    it "identifies floats" do
      expect(helper.cast("123.45")).to eql(123.45)
    end

    it "identifies common date formats" do
      expect(helper.cast("2019-01-01")).to eql(Date.new(2019, 1, 1).to_time)
      expect(helper.cast("05 May 2020")).to eql(Date.new(2020, 5, 5).to_time)
      expect(helper.cast("9/9/99")).to eql(Date.new(1999, 9, 9).to_time)
    end

  end

end
