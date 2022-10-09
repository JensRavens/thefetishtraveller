# frozen_string_literal: true

require "system_helper"

RSpec.describe "user in the feed" do
  fixtures :all
  let(:user) { users(:freddy) }

  before { login(user) }

  it "creates an event" do
    visit events_path
    click_on "submit_event"

    fill_in "name", with: "My new event"
    find("#event_location_details_id", visible: false).set("berlin")
    fill_in "start_at", with: 5.days.from_now.beginning_of_minute
    check "festival"
    screenshot "create_event"
    click_on "Create"

    expect(page).to have_content "My new event"
  end
end
