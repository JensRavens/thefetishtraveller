# frozen_string_literal: true

class BlufEventImportJob < ApplicationJob
  queue_as :default

  def perform
    @flyers = {}
    listings = event_listing
    create_locations(listings)
    listings.map! { |e| event_data(e) }
    created_events = Event.insert_all(listings, unique_by: :bluf_id, returning: [:id, :bluf_id])
    created_events.each do |event|
      url = flyers[event["bluf_id"]]
      event = Event.find(event["id"])
      next event.save if url.blank? # trigger slug generation

      Tempfile.open(SecureRandom.hex) do |f|
        f.binmode
        f.write HTTParty.get("https://bluf.com" + url).body
        f.rewind
        event.flyer.attach io: f, filename: url.split("/").last
      end
    end
  end

  private

  attr_reader :countries
  attr_reader :locations
  attr_reader :flyers

  def event_listing
    response = HTTParty.get "https://bluf.com/events/"
    page = Nokogiri::HTML(response.body)
    @countries = page.css("#cc option").map do |e|
      name = e.content
      country = Country.find_country_by_name(e.content)&.alpha2
      country = "US" if name == "USA"
      [
        e["value"],
        country
      ]
    end.to_h.compact
    page.css(".row.event").map do |event|
      {
        bluf_id: event["data-id"],
        city: event["data-city"],
        country_code: countries[event["data-country"]]
      }
    end.reject { |e| e[:country_code].nil? }
  end

  def find_location(city:, country_code:)
    locations.find do |loc|
      loc.second == country_code.downcase &&
        loc.third == city
    end
  end

  def create_locations(listings)
    @locations = Location.where(category: :city).pluck(:id, :country_code, :city)
    listings.each do |listing|
      location = find_location(city: listing[:city], country_code: listing[:country_code])
      next if location

      loc = Location.create! name: listing[:city], city: listing[:city], category: :city, country_code: listing[:country_code].downcase
      locations.push([loc.id, loc.city, loc.country_code])
    end
  end

  def event_data(listing)
    response = HTTParty.get "https://bluf.com/events/#{listing[:bluf_id]}"
    page = Nokogiri::HTML(response.body)
    date = page.css("h3").first&.content
    multiday = date&.include?("—")
    start_at = DateTime.parse(multiday ? date.split("—")[0] : date) if date
    end_at = DateTime.parse(multiday ? date.split("—")[1] : date) if date
    flyers[listing[:bluf_id]] = page.css("#launcher").first&.[]("src")
    {
      bluf_id: listing[:bluf_id],
      location_id: find_location(city: listing[:city], country_code: listing[:country_code])&.first,
      name: page.css("h1").first&.content,
      start_at: start_at,
      end_at: end_at,
      abstract: page.css(".container.u-cf .row:nth-child(2) p").first&.content,
      full_day: multiday,
      organizer_name: page.css("h6 + p").first&.content,
      website: page.css(".glyphicons-info-sign + a").first&.[]("href"),
      ticket_link: page.css(".glyphicons-ticket + a").first&.[]("href"),
      created_at: DateTime.current,
      updated_at: DateTime.current
    }
  end
end
