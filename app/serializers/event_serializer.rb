class EventSerializer < ApplicationSerializer
  attributes :name, :start_at, :end_at, :organizer_name, :official, :categories, :website, :ticket_link, :description, :owner_ids, :location_id, :abstract
  attribute :slug, key: :id

  image_attribue :hero
  image_attribue :logo

  def owner_ids
    object.owner_ids & [current_user&.id]
  end

  def location_id
    object.location.to_param
  end
end
