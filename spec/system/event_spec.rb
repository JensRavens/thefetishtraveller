# frozen_string_literal: true

require "system_helper"

RSpec.describe "user in the feed" do
  fixtures :all
  let(:user) { users(:freddy) }
  let(:event) { events(:folsom) }

  before { login(user) }

  it "creates an event" do
    visit events_path
    screenshot "events"
    click_on "submit_event"

    fill_in "name", with: "My new event"
    find("#event_location_details_id", visible: false).set("berlin")
    fill_in "start_at", with: 5.days.from_now.beginning_of_minute
    check "festival"
    screenshot "create_event"
    click_on "Create"

    expect(page).to have_content "My new event"
  end

  it "creates a subevent" do
    event.owners << user
    visit event_path(event)
    click_on "add_event"

    fill_in "name", with: "BLUF Social"
    find("#event_location_details_id", visible: false).set("berlin")
    check "official"
    screenshot "create_subevent"
    click_on "Create"

    click_on "Folsom", match: :first
    expect(page).to have_content "BLUF Social"
    screenshot "event"
  end
end
