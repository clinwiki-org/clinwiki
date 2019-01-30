require 'rails_helper'

describe SearchHelper do
  subject { Class.new.include(SearchHelper).new }

  context '#case_insensitive_regex_emulation' do
    it 'emulates case insensitive regex from case sensitive' do
      expect(case_insensitive_regex_emulation("Hello")).to eq(/[Hh][Ee][Ll][Ll][Oo]/)
    end

    it 'cares only about letters' do
      expect(case_insensitive_regex_emulation("H1e.*ll-o")).to eq(/[Hh]1[Ee].*[Ll][Ll]-[Oo]/)
    end
  end
end