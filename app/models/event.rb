class Event < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  include DocumentSerializable

  has_many :likes, dependent: :destroy

  attribute :name
  attribute :start_at, DateTime
  attribute :end_at, DateTime
  attribute :city
  attribute :country_code

  scope :published, -> { where('events.publish_at <= NOW()') }

  def published?
    publish_at&.past?
  end

  def publish!
    update! publish_at: DateTime.now
  end
end
