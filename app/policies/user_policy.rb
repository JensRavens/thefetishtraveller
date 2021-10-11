# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def show?
    logged_in? || record.public_profile?
  end

  def update?
    user == record
  end
end
