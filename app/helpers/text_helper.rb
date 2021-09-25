# frozen_string_literal: true

module TextHelper
  def simple_url(url)
    url.gsub(/https?:\/\/(www\.)?/, "").split("/").first
  end

  def formatted_event_date(event:)
    date = event.start_at
    date2 = event.end_at
    full_day = event.full_day

    return formatted_date(date, full_day: full_day) if date2.nil? || date.to_date == date2.to_date

    [formatted_date(date, full_day: true), formatted_date(date2, full_day: true)].join(" - ")
  end

  def formatted_date(date, full_day:)
    return l date.to_date if full_day

    l date, format: :short
  end
end
