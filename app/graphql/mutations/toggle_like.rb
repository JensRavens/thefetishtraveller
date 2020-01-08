module Mutations
  class ToggleLike < BaseMutation
    field :event, Types::EventType, null: false

    argument :event_id, ID, required: true
    argument :like, Boolean, required: true
    def resolve(event_id:, like:)
      return unless current_user
      event = Event.find(event_id)
      if like
        current_user.likes.create! event: event
      else
        current_user.likes.where(event_id: event_id).destroy_all
      end
      { event: event }
    end
  end
end
