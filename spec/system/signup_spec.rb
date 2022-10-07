# frozen_string_literal: true

require "system_helper"

RSpec.describe "signup" do
  it "allows signing up via email" do
    visit root_path
    screenshot "home"
    click_on "login"
    screenshot "login"
    click_on "login_via_email"
    fill_in "email", with: "new-user@example.com"
    screenshot "email_login"
    click_on "email.login"
    expect(page).to have_content "link_in_email"

    visit last_mail!.button_link
    expect(page).to have_content ".welcome"

    fill_in "slug", with: "onboarding-user"
    fill_in "location_description", with: "Berlin, Germany"
    fill_in "bio", with: "Hello #world"
    screenshot "onboarding"
    click_on "continue"

    fill_in "instagram", with: "insta-profile-name"
    screenshot "onboarding_social"
    click_on "continue"

    choose "visibility_public"
    screenshot "onboarding_public"
    click_on "continue"

    expect(page).to have_content "onboarding-user"
    expect(page).to have_content "insta-profile-name"
    expect(page).to have_content "Hello #world"
  end

  it "rejects the login link if it is expired" do
    visit root_path
    click_on "login"
    click_on "login_via_email"
    fill_in "email", with: "new-user@example.com"
    click_on "email.login"
    expect(page).to have_content "link_in_email"
    link = last_mail!.button_link

    travel 2.hours # force the link to expire

    visit link
    expect(page).to have_content ".link_expired"
  end
end
