require 'rails_helper'

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
