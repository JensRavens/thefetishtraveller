class EventSerializer < ActiveModel::Serializer
  attributes :name, :start_at, :end_at, :city, :country_code
  attribute :slug, key: :id
end
