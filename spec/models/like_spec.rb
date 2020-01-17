# frozen_string_literal: true

# == Schema Information
#
# Table name: likes
#
#  id         :uuid             not null, primary key
#  event_id   :uuid             not null
#  user_id    :uuid             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require "rails_helper"

RSpec.describe Like, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
