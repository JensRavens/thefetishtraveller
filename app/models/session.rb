# frozen_string_literal: true

# == Schema Information
#
# Table name: sessions
#
#  id         :uuid             not null, primary key
#  user_id    :uuid
#  user_agent :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Session < ApplicationRecord
  belongs_to :user
end
