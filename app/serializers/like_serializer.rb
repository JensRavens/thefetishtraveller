# frozen_string_literal: true

# == Schema Information
#
# Table name: likes
#
#  id         :uuid             not null, primary key
#  user_id    :uuid             not null
#  post_id    :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class LikeSerializer < ApplicationSerializer
  attributes :id, :event_id
end
