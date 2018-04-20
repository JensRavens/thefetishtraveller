class SessionSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :level

  def level
    object.user.level
  end
end
