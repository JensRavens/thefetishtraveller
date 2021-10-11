# == Schema Information
#
# Table name: posts
#
#  id                   :uuid             not null, primary key
#  user_id              :uuid             not null
#  location_description :string
#  description          :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
class Post < ApplicationRecord
  belongs_to :user

  has_one_attached :image

  scope :reverse_chronologic, -> { order(created_at: :desc) }
end
