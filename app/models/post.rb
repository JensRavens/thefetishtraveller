# frozen_string_literal: true

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
  HASHTAG_REGEX = /\B(\#[a-zA-Z0-9]+\b)(?!;)/.freeze

  has_many :likes, dependent: :delete_all
  has_many :comments, dependent: :delete_all
  belongs_to :user

  has_one_attached :image

  acts_as_taggable_on :tags

  scope :reverse_chronologic, -> { order(created_at: :desc) }
  scope :for_user, ->(user) { where(user_id: user.followed_users).or(where(user: user)) }

  validates :image, :description, presence: true

  before_save do
    self.tag_list = parsed_tags if description_changed?
  end

  private

  def parsed_tags
    description.to_s.scan(HASHTAG_REGEX).flatten.map { |tag| tag.strip[1..] }
  end
end
