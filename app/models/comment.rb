# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id         :uuid             not null, primary key
#  post_id    :uuid             not null
#  user_id    :uuid             not null
#  text       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  scope :reverse_chronologic, -> { order(created_at: :desc) }
end
