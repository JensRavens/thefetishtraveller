class User < ApplicationRecord
  has_secure_password validations: false

  has_many :likes, dependent: :destroy
  has_many :events, through: :likes
  has_many :sessions, dependent: :destroy

  has_and_belongs_to_many :owned_events, class_name: "Event"
  has_and_belongs_to_many :owned_locations, class_name: "Location"

  scope :guest, -> { where(email: nil) }

  def migrate_to(user)
    likes.update_all user_id: user.id
  end

  def guest?
    email.blank?
  end

  def level
    guest? ? "guest" : "user"
  end
end
