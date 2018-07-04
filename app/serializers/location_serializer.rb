class LocationSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :city, :zip, :address, :country_code, :lat, :lon

  def lat
    object.lat&.to_f
  end

  def lon
    object.lon&.to_f
  end
end
