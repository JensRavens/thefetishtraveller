class EventSerializer < ActiveModel::Serializer
  attributes :name, :start_at, :end_at, :organizer_name, :official, :categories, :website, :ticket_link, :description, :owner_ids
  attribute :slug, key: :id

  has_one :location

  def owner_ids
    object.owner_ids & [current_user&.id]
  end
end
