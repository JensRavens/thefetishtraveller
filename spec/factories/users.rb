# == Schema Information
#
# Table name: users
#
#  id              :uuid             not null, primary key
#  email           :string
#  first_name      :string
#  last_name       :string
#  password_digest :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  roles           :string           default([]), not null, is an Array
#  facebook_id     :string
#

FactoryBot.define do
  factory :user do
    email "MyString"
    first_name "MyString"
    last_name "MyString"
    password_digest "MyString"
  end
end
