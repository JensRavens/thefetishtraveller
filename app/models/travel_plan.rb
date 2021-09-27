# frozen_string_literal: true

# == Schema Information
#
# Table name: travel_plans
#
#  id         :uuid             not null, primary key
#  event_id   :uuid             not null
#  user_id    :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class TravelPlan < ApplicationRecord
  belongs_to :user
  belongs_to :event
end
