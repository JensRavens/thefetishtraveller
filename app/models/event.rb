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
  attribute :abstract
  attribute :description
  attribute :series

  scope :published, -> { where('events.publish_at <= NOW()') }

  has_many :events, dependent: :destroy
  belongs_to :event, required: false

  has_and_belongs_to_many :owners, class_name: "User"

  has_one_attached :hero
  has_one_attached :logo

  def published?
    publish_at&.past?
  end

  def publish!
    update! publish_at: DateTime.now
  end
end
