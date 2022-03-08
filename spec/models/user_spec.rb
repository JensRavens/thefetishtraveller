# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                   :uuid             not null, primary key
#  email                :string
#  first_name           :string
#  last_name            :string
#  password_digest      :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  roles                :string           default([]), not null, is an Array
#  facebook_id          :string
#  apple_id             :string
#  slug                 :string
#  location_description :string
#  bio                  :string
#  twitter              :string
#  instagram            :string
#  recon                :string
#  romeo                :string
#  bluf                 :string
#  visibility           :string
#  onlyfans             :string
#  email_preferences    :string
#  google_id            :string
#
require "rails_helper"

RSpec.describe User do
  fixtures :all

  let(:user) { users(:john_doe) }
  let(:other_user) { users(:freddy) }
  let(:admin) { users(:admin) }
  let(:post) { posts(:simple) }

  context "when dealing with roles" do
    it "can be an admin" do
      expect(user).not_to be_admin
      expect(admin).to be_admin
      expect(User.admin).not_to include(user)
      expect(User.admin).to include(admin)
    end
  end

  context "liking a post" do
    it "notifies the author" do
      expect do
        perform_enqueued_jobs do
          user.like!(post: post)
        end
      end.to change { post.user.notifications.count }.by 1
    end
  end

  context "commenting a post" do
    it "notifies the author" do
      expect do
        perform_enqueued_jobs do
          user.comment!(post: post, text: "hello")
        end
      end.to change { post.user.notifications.count }.by 1
    end
  end

  context "following a user" do
    it "notifies the user" do
      expect do
        perform_enqueued_jobs do
          user.follow!(user: other_user)
        end
      end.to change { other_user.notifications.count }.by 1
    end
  end

  context "finishing registration" do
    it "notifies other users of the platform" do
      user.update! avatar: fixture_file_upload("picture.jpg")
      expect do
        perform_enqueued_jobs do
          user.onboarding_finished!
        end
      end.to change { other_user.notifications.count }.by 1
    end

    it "does not tell others if there is no avatar" do
      expect do
        perform_enqueued_jobs do
          user.onboarding_finished!
        end
      end.not_to change { other_user.notifications.count }
    end
  end
end
