# == Schema Information
#
# Table name: likes
#
#  id         :uuid             not null, primary key
#  event_id   :uuid             not null
#  user_id    :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :like do
    event_id ""
    user_id ""
  end
end
