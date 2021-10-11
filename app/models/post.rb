# == Schema Information
#
# Table name: posts
#
#  id                   :uuid             not null, primary key
#  author_id            :uuid             not null
#  location_description :string
#  description          :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
class Post < ApplicationRecord
  belongs_to :author, class_name: "User"

  has_one_attached :image
end
