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
#  featured       :boolean          default(FALSE), not null
#

class EventSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :start_at, :end_at, :organizer_name, :official, :categories, :website,
             :ticket_link, :description, :owner_ids, :location_id, :abstract, :event_id, :series, :full_day

  image_attribute :hero
  image_attribute :header
  image_attribute :logo
  image_attribute :flyer
  image_list_attribute :gallery_images

  attribute :editable, if: -> { instance_options[:edit_info] } do
    current_user&.admin? || current_user&.owned_event_ids&.include?(object.id) || false
  end
end
