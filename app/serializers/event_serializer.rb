class EventSerializer < ActiveModel::Serializer
  attributes :name
  attribute :slug, key: :id
end
