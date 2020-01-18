# frozen_string_literal: true

# == Schema Information
#
# Table name: activities
#
#  id            :uuid             not null, primary key
#  user_id       :uuid             not null
#  action        :string           not null
#  modifications :jsonb            not null
#  object_id     :uuid             not null
#  object_type   :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :object, polymorphic: true
end
