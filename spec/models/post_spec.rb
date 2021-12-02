# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id                   :uuid             not null, primary key
#  user_id              :uuid             not null
#  location_description :string
#  description          :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
require "rails_helper"

RSpec.describe Post do
  fixtures :all

  let(:user) { users(:john_doe) }
  let(:follower) { users(:freddy) }

  context "creating a post" do
    it "notifies the followers" do
      expect do
        perform_enqueued_jobs do
          user.post! image: fixture_file_upload("picture.jpg"), description: "hello world"
        end
      end.to change { follower.notifications.count }.by 1
    end
  end
end
