require "rails_helper"

RSpec.describe User, type: :model do
  it "should save expected values" do
    expect(User.count).to eq(0)
    email_addr = "sue.smith@gmail.com"
    first = "sue"
    last = "smith"
    query_string = "chordoma"
    begin
      User.new(email: email_addr, first_name: first, last_name: last).save!
    rescue StandardError => e
      expect(e.record.errors.messages[:password].first).to eq("can't be blank")
    end
    pwd = "abc"
    begin
      User.new(email: email_addr, first_name: first, last_name: last, password: pwd).save!
    rescue StandardError => e
      expect(e.record.errors.messages[:password].first).to eq("is too short (minimum is 8 characters)")
    end
    pwd = "abc12345"
    u = User.new(email: email_addr, first_name: first, last_name: last, password: pwd,
                 default_query_string: query_string)
    u.save!
    expect(User.count).to eq(1)
    expect(u.email).to eq(email_addr)
    expect(u.first_name).to eq(first)
    expect(u.last_name).to eq(last)
    expect(u.default_query_string).to eq(query_string)
  end
end
