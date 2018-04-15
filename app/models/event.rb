class Event < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  include DocumentSerializable

  has_many :likes, dependent: :destroy
  belongs_to :location

  attribute :name
  attribute :start_at, DateTime
  attribute :end_at, DateTime
  attribute :organizer_name
  attribute :official, Axiom::Types::Boolean, default: false
  attribute :categories, [String], default: []
  attribute :website
  attribute :ticket_link
  attribute :description

  scope :published, -> { where('events.publish_at <= NOW()') }

  def published?
    publish_at&.past?
  end

  def publish!
    update! publish_at: DateTime.now
  end
end
