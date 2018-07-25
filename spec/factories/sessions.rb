# == Schema Information
#
# Table name: sessions
#
#  id         :uuid             not null, primary key
#  user_id    :uuid
#  user_agent :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :session do
    user_id ""
    user_agent "MyText"
  end
end
