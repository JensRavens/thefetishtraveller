# frozen_string_literal: true

Yael::Bus.shared.routing do
  dispatch :liked_post, to: "notification"
  dispatch :commented_post, to: "notification"
  dispatch :followed_user, to: "notification"
  dispatch :event_created, to: "notification"
  dispatch :posted, to: "notifications"
end
