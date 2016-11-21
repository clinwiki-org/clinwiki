require 'rails_helper'

RSpec.describe Tag, type: :model do
  it 'should save expected values' do
    nct_id='NCT0000012'
    email_addr='sue.smith@gmail.com'
    first='sue'
    last='smith'
    pwd='abc12345'
    tag='chordoma'

    expect(Tag.count).to eq(0)
    u=User.new({:email=>email_addr, :first_name=>first, :last_name=>last, :password=>pwd})
    u.save!
    t=Tag.new({:value=>tag,:user=>u,:nct_id=>nct_id})
    t.save!
    expect(Tag.count).to eq(1)
    expect(t.value).to eq(tag)
    expect(t.nct_id).to eq(nct_id)
    expect(t.user.last_name).to eq(last)
  end
end
