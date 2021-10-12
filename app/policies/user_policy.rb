# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def show?
    logged_in? || record.public_profile? || admin?
  end

  def travel_plans?
    show?
  end

  def update?
    user == record
  end

  def follow?
    true
  end

  def message?
    true
  end
end
