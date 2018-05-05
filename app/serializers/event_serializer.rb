class EventSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :start_at, :end_at, :organizer_name, :official, :categories, :website, 
    :ticket_link, :description, :owner_ids, :location_id, :abstract, :event_id, :series

  image_attribue :hero
  image_attribue :logo
  image_attribue :flyer
end
