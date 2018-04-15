class EventSerializer < ActiveModel::Serializer
  attributes :name, :start_at, :end_at, :organizer_name, :official, :categories, :website, :ticket_link, :description
  attribute :slug, key: :id

  has_one :location
end
