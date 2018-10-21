# == Schema Information
#
# Table name: locations
#
#  id           :uuid             not null, primary key
#  properties   :jsonb            not null
#  slug         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  name         :string           not null
#  country_code :string           not null
#  address      :string
#  zip          :string
#  city         :string
#  lat          :decimal(, )
#  lon          :decimal(, )
#  category     :string
#

class LocationSerializer < ApplicationSerializer
  attributes :id, :slug, :name, :city, :zip, :address, :country_code, :lat, :lon, :category

  def lat
    object.lat&.to_f
  end

  def lon
    object.lon&.to_f
  end
end
