class SessionSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :level, :liked_event_ids, :owned_event_ids

  def level
    object.user.level
  end

  def liked_event_ids
    object.user.events.map(&:to_param)
  end

  def owned_event_ids
    object.user.owned_events.map(&:to_param)
  end

  def owned_location_ids
    object.user.owned_locations.map(&:to_param)
  end
end
