# == Schema Information
#
# Table name: titles
#
#  id                :uuid             not null, primary key
#  slug              :string           not null
#  name              :string           not null
#  organisation_name :string
#  country_code      :string           not null
#  location_id       :uuid
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Title < ApplicationRecord
  extend FriendlyId

  has_many :titleholders, dependent: :destroy
  belongs_to :location, optional: true

  friendly_id :name, use: :slugged
  validates :name, :country_code, presence: true

  def country
    Country[country_code.to_sym]
  end
end
