class User < ApplicationRecord
  has_secure_password validations: false

  has_many :likes, dependent: :destroy
  has_many :events, through: :likes
end
