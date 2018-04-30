class SessionSerializer < ApplicationSerializer
  attributes :id, :user_id, :level, :liked_event_ids, :owned_event_ids

  def level
    object.user.level
  end

  def liked_event_ids
    object.user.event_ids
  end

  def owned_event_ids
    object.user.owned_event_ids
  end

  def owned_location_ids
    object.user.owned_location_ids
  end
end
