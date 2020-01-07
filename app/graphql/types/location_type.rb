module Types
  class LocationType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :country_code, String, null: false
    field :country_name, String, null: true
    field :address, String, null: true
    field :zip, String, null: true
    field :city, String, null: true
    field :lat, Float, null: true
    field :lon, Float, null: true
    field :category, String, null: true
    field :timezone, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :events, EventType.connection_type, null: false
  end
end
