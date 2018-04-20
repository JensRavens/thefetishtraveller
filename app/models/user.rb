class User < ApplicationRecord
  has_secure_password validations: false

  has_many :likes, dependent: :destroy
  has_many :events, through: :likes

  has_and_belongs_to_many :owned_events, class_name: "Event"
  has_and_belongs_to_many :owned_locations, class_name: "Location"
end
