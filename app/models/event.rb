class Event < ApplicationRecord
  include DocumentSerializable

  attribute :name

  scope :published, -> { where('events.publish_at <= NOW()') }

  def published?
    publish_at&.past?
  end

  def publish!
    update! publish_at: DateTime.now
  end
end
