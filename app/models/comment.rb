class Comment < ApplicationRecord
  belongs_to :post
  belongs_to :user

  scope :reverse_chronologic, -> { order(created_at: :desc) }
end
