# frozen_string_literal: true

# == Schema Information
#
# Table name: events
#
#  id             :uuid             not null, primary key
#  properties     :jsonb            not null
#  publish_at     :datetime
#  publish_until  :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  slug           :string
#  location_id    :uuid
#  event_id       :uuid
#  name           :string           not null
#  start_at       :datetime         not null
#  end_at         :datetime         not null
#  website        :string
#  official       :boolean          default(FALSE), not null
#  abstract       :text
#  description    :text
#  ticket_link    :string
#  organizer_name :string
#  categories     :text             default([]), not null, is an Array
#  series         :string
#  full_day       :boolean          default(FALSE), not null
#  bluf_id        :string
#
require "rails_helper"

RSpec.describe Event do
  fixtures :all

  let(:user) { users(:john_doe) }
  let(:admin) { users(:admin) }
  let(:berlin) { locations(:berlin) }

  context "when creating a new event" do
    it "notifies an admin for review" do
      expect do
        perform_enqueued_jobs do
          Event.build_submit(name: "Event", start_at: DateTime.current, location: berlin, owners: [user]).save!
        end
      end.to change { admin.notifications.count }.by 1
    end
  end
end
