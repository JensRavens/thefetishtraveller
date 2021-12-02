# frozen_string_literal: true

# == Schema Information
#
# Table name: articles
#
#  id             :uuid             not null, primary key
#  slug           :string           not null
#  title          :string           not null
#  user_id        :uuid             not null
#  publish_at     :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  layout_options :jsonb            not null
#
class Article < ApplicationRecord
  extend FriendlyId
  include Reviewable

  belongs_to :user

  scope :listed, -> { published.order(publish_at: :desc) }

  has_rich_text :content
  has_rich_text :abstract
  friendly_id :title, use: :slugged
  has_one_attached :hero
  store_accessor :layout_options, :hero_background_color
  acts_as_taggable_on :article_formats

  def magazine_relevancy
    Time.current - (publish_at || Time.current)
  end
end
