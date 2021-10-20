# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def show?
    logged_in? || record.visibility == "public" || admin?
  end

  def travel_plans?
    show?
  end

  def update?
    user == record
  end

  def follow?
    user != record && user&.onboarded?
  end

  def message?
    user != record && user&.onboarded?
  end
end
