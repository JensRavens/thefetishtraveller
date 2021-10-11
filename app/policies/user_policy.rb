# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def show?
    logged_in?
  end

  def update?
    user == record
  end
end
