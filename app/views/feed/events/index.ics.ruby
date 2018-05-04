calendar = Icalendar::Calendar.new
calendar.append_custom_property("X-WR-CALNAME;VALUE=TEXT", "thefetishtraveller.com")
@events.each do |event|
  ics = event.to_ics
  calendar.add_event ics if ics
end
calendar.to_ical
