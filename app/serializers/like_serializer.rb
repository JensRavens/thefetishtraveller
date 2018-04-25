class LikeSerializer < ApplicationSerializer
  attributes :id, :event_id

  def event_id
    object.event.slug
  end
end
