# == Schema Information
#
# Table name: locations
#
#  id           :uuid             not null, primary key
#  properties   :jsonb            not null
#  slug         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  name         :string           not null
#  country_code :string           not null
#  address      :string
#  zip          :string
#  city         :string
#  lat          :decimal(, )
#  lon          :decimal(, )
#  category     :string
#

FactoryBot.define do
  factory :location do
    name "MyString"
    slug "MyString"
    lat "MyString"
    lon "MyString"
    address "MyString"
    city "MyString"
    zip "MyString"
    country_code "MyString"
  end
end
