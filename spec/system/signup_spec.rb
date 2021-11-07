# frozen_string_literal: true

require "system_helper"

RSpec.describe "signup" do
  it "allows signing up via email" do
    visit root_path(locale: :en, debug: true)
    click_on "login"
    click_on "login_via_email"
    fill_in "email", with: "new-user@example.com"
    click_on "email.login"
    expect(page).to have_content "link_in_email"

    visit last_mail!.button_link + "&debug=true"
    expect(page).to have_content ".welcome"

    fill_in "slug", with: "onboarding-user"
    fill_in "location_description", with: "Berlin, Germany"
    fill_in "bio", with: "Hello #world"
    click_on "continue"

    fill_in "instagram", with: "insta-profile-name"
    click_on "continue"

    choose "visibility_public"
    click_on "continue"

    expect(page).to have_content "onboarding-user"
    expect(page).to have_content "insta-profile-name"
    expect(page).to have_content "Hello #world"
  end
end
