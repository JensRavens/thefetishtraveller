# frozen_string_literal: true

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
#  timezone     :string
#  bluf_id      :string
#

class Location < ApplicationRecord
  include DocumentSerializable
  extend FriendlyId
  friendly_id :name, use: :slugged

  has_many :events, dependent: :restrict_with_exception
  has_and_belongs_to_many :owners, class_name: "User"

  validates :name, :country_code, presence: true

  def country
    Country[country_code.to_sym]
  end

  def country_name
    country&.name
  end

  def description
    [name, city, country.name].compact.uniq.join(", ")
  end

  def coordinates?
    lat.present? && lon.present?
  end
end
