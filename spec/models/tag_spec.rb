require "rails_helper"

RSpec.describe Tag, type: :model do
  it "should save expected values" do
    nct_id = "NCT0000012"
    email_addr = "sue.smith@gmail.com"
    first = "sue"
    last = "smith"
    pwd = "abc12345"
    tag = "chordoma"

    current_user = User.new(email: email_addr, first_name: first, last_name: last, password: pwd)
    current_user.save!
    expect(Tag.count).to eq(0)
    # use an empty value
    params = { nct_id: nct_id, new_tag: "" }
    Tag.create_from(params, current_user)
    expect(Tag.count).to eq(0)
    # use a legit value
    params = { nct_id: nct_id, new_tag: tag }
    t = Tag.create_from(params, current_user)
    expect(Tag.count).to eq(1)
    expect(t.value).to eq(tag)
    expect(t.nct_id).to eq(nct_id)
    expect(t.user.last_name).to eq(last)
    # try to create duplicate
    t = Tag.create_from(params, current_user)
    expect(t).to eq(false)
    expect(Tag.count).to eq(1)
  end
end
