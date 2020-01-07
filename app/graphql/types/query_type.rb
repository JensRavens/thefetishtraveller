module Types
  class QueryType < Types::BaseObject
    field :locations, LocationType.connection_type, null: false, description: "List all locations"

    def locations
      Location.all
    end

    field :events, EventType.connection_type, null: false, description: "Search for events"

    def events
      Event.published.includes(:location)
    end
  end
end
