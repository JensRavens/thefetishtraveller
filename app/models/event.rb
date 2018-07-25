# == Schema Information
#
# Table name: events
#
#  id             :uuid             not null, primary key
#  properties     :jsonb            not null
#  publish_at     :datetime
#  publish_until  :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  slug           :string
#  location_id    :uuid
#  event_id       :uuid
#  name           :string           not null
#  start_at       :datetime         not null
#  end_at         :datetime         not null
#  website        :string
#  official       :boolean          default(FALSE), not null
#  abstract       :text
#  description    :text
#  ticket_link    :string
#  organizer_name :string
#  categories     :text             default([]), not null, is an Array
#  series         :string
#

class Event < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  include DocumentSerializable

  has_many :likes, dependent: :destroy
  belongs_to :location

  scope :published, -> { where('events.publish_at <= NOW()') }

  has_many :events, dependent: :destroy
  belongs_to :event, required: false

  has_and_belongs_to_many :owners, class_name: "User"

  has_one_attached :hero
  has_one_attached :logo
  has_one_attached :flyer

  def published?
    publish_at&.past?
  end

  def publish!
    update! publish_at: DateTime.now
  end

  def to_ics
    event = Icalendar::Event.new
    event.dtstart = Icalendar::Values::Date.new start_at
    event.dtstart.ical_params = { "VALUE" => "DATE" }
    event.dtend = Icalendar::Values::Date.new end_at + 1.day
    event.dtend.ical_params = { "VALUE" => "DATE" }
    event.summary = name
    event.description = abstract if abstract.present?
    event.url = "https://#{ENV.fetch('HOST') { 'thefetishtraveller.com' }}/events/#{slug}"
    event.geo = [location.lat, location.lon] if location&.lat && location&.lon
    event.location = location&.description
    event
  end
end
