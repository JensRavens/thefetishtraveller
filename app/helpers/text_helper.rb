# frozen_string_literal: true

module TextHelper
  def simple_url(url)
    url.gsub(/https?:\/\/(www\.)?/, "").split("/").first
  end

  def formatted_date_range(start_on, end_on)
    [formatted_year_date(start_on), formatted_year_date(end_on)].uniq.join(" - ")
  end

  def formatted_year_date(date)
    return t(".now") if date.nil?
    return date.year if date.day == 1 && date.month == 1

    l date
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

  def tagged_format(text, context: :posts)
    text = simple_format(text)
    text.gsub(Post::HASHTAG_REGEX) do |match|
      link_to match, public_send("#{context}_path", tag: match[1..]), class: :link
    end.html_safe
  end
end
