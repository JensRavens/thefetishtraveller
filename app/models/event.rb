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
#  full_day       :boolean          default(FALSE), not null
#

class Event < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged
  include DocumentSerializable
  CATEGORIES = ["bluf", "csd", "culture", "election", "festival", "party", "social"].freeze

  has_many :likes, dependent: :destroy
  belongs_to :location

  scope :published, -> { where('events.publish_at <= NOW()') }
  scope :with_attachments, -> { with_attached_hero.with_attached_header.with_attached_logo.with_attached_flyer.with_attached_gallery_images }
  scope :in_future, -> { where('events.end_at >= NOW()') }

  has_many :events, dependent: :destroy
  belongs_to :event, required: false

  has_and_belongs_to_many :owners, class_name: "User"

  has_one_attached :hero
  has_one_attached :header
  has_one_attached :logo
  has_one_attached :flyer

  has_many_attached :gallery_images

  def published?
    publish_at&.past?
  end

  def publish!
    update! publish_at: DateTime.now
  end

  def categories=(values)
    self[:categories] = Array.wrap(values).select { |e| Event::CATEGORIES.include?(e) }
  end

  def to_ics
    event = Icalendar::Event.new
    if full_day
      event.dtstart = Icalendar::Values::Date.new start_at
      event.dtstart.ical_params = { "VALUE" => "DATE" }
      event.dtend = Icalendar::Values::Date.new end_at + 1.day
      event.dtend.ical_params = { "VALUE" => "DATE" }
    else
      event.dtstart = start_at
      event.dtend = end_at
    end
    event.summary = name
    event.description = abstract if abstract.present?
    event.url = "https://#{ENV.fetch('HOST') { 'thefetishtraveller.com' }}/events/#{slug}"
    event.geo = [location.lat, location.lon] if location&.lat && location&.lon
    event.location = location&.description
    event
  end
end
