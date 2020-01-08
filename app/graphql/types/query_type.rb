module Types
  class QueryType < Types::BaseObject
    field :locations, LocationType.connection_type, null: false, description: "List all locations"

    def locations
      Location.all
    end

    field :location_by_id, LocationType, null: true, description: "Retrieve a location by id" do
      argument :id, ID, required: true
    end

    def location_by_id(id:)
      Location.find(id)
    end

    field :location_by_slug, LocationType, null: true, description: "Retrieve a location by slug" do
      argument :slug, String, required: true
    end

    def location_by_slug(slug:)
      Location.friendly.find(slug)
    end

    field :events, EventType.connection_type, null: false, description: "Search for events"

    def events
      Event.published
    end

    field :event_by_slug, EventType, null: true, description: "Retrieve an event by slug" do
      argument :slug, String, required: true
    end

    def event_by_slug(slug:)
      Event.friendly.find(slug)
    end
  end
end
