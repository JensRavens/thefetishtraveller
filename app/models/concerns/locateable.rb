# frozen_string_literal: true

module Locateable
  extend ActiveSupport::Concern

  included do
    belongs_to :location

    def location_details=(value)
      return if location&.google_id == value[:id]

      self.location = Location.find_by(google_id: value[:id])
      return if location

      timezone = value[:timezone].presence
      if timezone
        timezone = (timezone.to_i * 60).then { |offset| ActiveSupport::TimeZone.all.find { |e| e.utc_offset == offset } }&.name
      end

      self.location = Location.find_by(name: value[:name], country_code: value[:country_code])
      if location
        location.google_id = value[:id]
        location.address ||= value[:address]
        location.zip ||= value[:zip]
        location.city ||= value[:city]
        location.lat ||= value[:lat]
        location.lon ||= value[:lon]
        location.timezone ||= timezone
        location.save!
        return
      end

      self.location = Location.new(google_id: value[:id], timezone: timezone, **value.slice("name", "country_code", "address", "zip", "city", "lat", "lon"))
    end
  end
end
