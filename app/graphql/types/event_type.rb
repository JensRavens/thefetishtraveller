module Types
  class EventType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :location, LocationType, null: false
    field :published, Boolean, null: false, method: :published?
    field :start_at, GraphQL::Types::ISO8601DateTime, null: false
    field :end_at, GraphQL::Types::ISO8601DateTime, null: false
    field :full_day, Boolean, null: false
    field :website, String, null: true
    field :official, Boolean, null: false
    field :abstract, String, null: true
    field :description, String, null: true
    field :ticket_link, String, null: true
    field :organizer_name, String, null: true
    field :categories, [String], null: false
    field :series_name, String, null: true, method: :series
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :liked, Boolean, null: false

    def liked
      current_user&.likes&.where(event_id: object.id)&.any? || false
    end
  end
end
