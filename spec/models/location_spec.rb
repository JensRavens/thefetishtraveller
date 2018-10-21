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
#

require 'rails_helper'

RSpec.describe Location, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
