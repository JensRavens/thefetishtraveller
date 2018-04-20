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
  has_and_belongs_to_many :owners, class_name: "User"

  validates :name, presence: true
end
