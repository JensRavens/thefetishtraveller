# frozen_string_literal: true

require "rails_helper"

RSpec.describe Message do
  fixtures :all

  let(:user) { users(:john_doe) }
  let(:receiver) { users(:freddy) }
  let(:conversation) { user.private_conversation(with: receiver) }

  context "sending a message" do
    it "notifies the receiver" do
      expect do
        perform_enqueued_jobs do
          conversation.send_message(user: user, text: "Hello!")
        end
      end.to change { Notification.count }.by 1
      notification = receiver.notifications.last!
      expect(notification).to have_attributes sender: user, user: receiver
    end
  end
end
