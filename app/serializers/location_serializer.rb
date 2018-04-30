class LocationSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :city, :zip, :address, :country_code, :lat, :lon
end
