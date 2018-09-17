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
#

class EventSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :start_at, :end_at, :organizer_name, :official, :categories, :website,
    :ticket_link, :description, :owner_ids, :location_id, :abstract, :event_id, :series

  image_attribue :hero
  image_attribue :header
  image_attribue :logo
  image_attribue :flyer
end
