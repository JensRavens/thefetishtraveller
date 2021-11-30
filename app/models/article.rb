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
  include Reviewable

  belongs_to :user

  scope :published, -> { where(published_at: ..DateTime.current) }

  has_rich_text :content
  has_rich_text :abstract
  friendly_id :title, use: :slugged
  has_one_attached :hero
  store_accessor :layout_options, :hero_background_color
end
