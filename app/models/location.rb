class Location < ApplicationRecord
  include DocumentSerializable
  extend FriendlyId
  friendly_id :name, use: :slugged

  attribute :name
  attribute :city
  attribute :address
  attribute :lat, Float
  attribute :lon, Float
  attribute :zip
  attribute :country_code, Symbol

  has_many :events, dependent: :destroy
end
