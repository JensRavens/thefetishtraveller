# == Schema Information
#
# Table name: articles
#
#  id           :uuid             not null, primary key
#  title        :string           not null
#  user_id      :uuid             not null
#  published_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require 'rails_helper'

RSpec.describe Article, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
