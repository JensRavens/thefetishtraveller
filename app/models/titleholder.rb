# frozen_string_literal: true

# == Schema Information
#
# Table name: titleholders
#
#  id         :uuid             not null, primary key
#  slug       :string           not null
#  title_id   :uuid             not null
#  user_id    :uuid
#  full_title :string           not null
#  name       :string           not null
#  start_on   :date             not null
#  end_on     :date
#  url        :string
#  abstract   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Titleholder < ApplicationRecord
  extend FriendlyId

  belongs_to :title
  belongs_to :user, optional: true, touch: true

  scope :listed, -> { order(start_on: :desc) }
  scope :searched, ->(term) { where("titleholders.full_title ILIKE :term OR titleholders.name ILIKE :term", term: "%#{term}%") }

  friendly_id :full_title, use: :slugged
  validates :full_title, :name, :start_on, presence: true

  has_one_attached :picture
  has_many_attached :gallery_images

  class << self
    def submit_email(user:)
      <<~TXT
        I would like to add the following titleholder to the titleholders archive:

        Name:
        Title:
        Organizer/Sponsor/Club:
        #{"My Profile Name: #{user.public_name}" if user}
        Election Date:
        Stepdown Date (if happened already):
        Short Bio (optional):

        I am attaching a picture with my sash here:
      TXT
    end
  end

  def magazine_relevancy
    Time.current - start_on.to_time
  end
end
