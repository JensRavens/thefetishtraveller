class LocationSerializer < ActiveModel::Serializer
  attributes :name, :city, :zip, :address, :country_code, :lat, :lon
  attribute :slug, key: :id
end
