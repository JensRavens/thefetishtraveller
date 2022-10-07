# frozen_string_literal: true

require "system_helper"

RSpec.describe "user in the feed" do
  fixtures :all
  let(:user) { users(:freddy) }
  let(:post) { posts(:simple) }

  before { login(user) }

  it "posts to the feed" do
    visit root_path
    click_on "create_a_post"

    attach_file "image", "picture.jpg"
    fill_in "location_description", with: "Berlin, Germany"
    fill_in "post.description", with: "Hello World #fyp"
    screenshot "post_create"
    click_on "Create"

    expect(page).to have_content "Berlin, Germany"
    expect(page).to have_content "Hello World"
  end

  it "likes a post" do
    visit post_path(post)
    click_on "like"
    expect(page).to have_content "liked_by_html name=freddy"
    screenshot "liked_post"
  end

  it "unlikes a post" do
    post.likes.create(user: user)
    visit post_path(post)
    click_on "unlike"
    expect(page).not_to have_content "liked"
  end

  it "comments on a post" do
    visit post_path(post)
    click_on "comment"
    fill_in "add_a_comment", with: "nice pic!"
    click_on "post_comment"
    expect(page).to have_content "nice pic!"
    screenshot "commented_post"
  end

  it "updates a posts" do
    login post.user
    visit post_path(post)
    open_context
    click_on "edit"
    fill_in "location_description", with: "updated description"
    click_on "posts.edit.save"
  end
end
