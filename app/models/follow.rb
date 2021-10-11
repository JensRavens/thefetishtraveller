# == Schema Information
#
# Table name: follows
#
#  id         :uuid             not null, primary key
#  user_id    :uuid             not null
#  profile_id :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Follow < ApplicationRecord
  belongs_to :user
  belongs_to :profile, class_name: "User"
end
