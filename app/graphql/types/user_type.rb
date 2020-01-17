# frozen_string_literal: true

module Types
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: false
    field :last_name, String, null: false
    field :name, String, null: false
    field :level, String, null: false
    field :guest, Boolean, null: false, method: :guest?

    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :events, EventType.connection_type, null: false
    field :has_events, Boolean, null: false, method: :events?

    def events
      AssociationLoader.for(User, :events).load(object)
    end

    def events?
      events.then(&:any?)
    end
  end
end
