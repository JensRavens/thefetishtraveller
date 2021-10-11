class Follow < ApplicationRecord
  belongs_to :user
  belongs_to :profile, class_name: "User"
end
