# == Schema Information
#
# Table name: articles
#
#  id           :uuid             not null, primary key
#  title        :string           not null
#  user_id      :uuid             not null
#  published_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Article < ApplicationRecord
  extend FriendlyId

  belongs_to :user

  scope :published, -> { where(published_at: ..DateTime.current) }

  has_rich_text :content
  friendly_id :title, use: :slugged
  has_one_attached :hero

  def pending_review?
    publish_at.nil?
  end
end
