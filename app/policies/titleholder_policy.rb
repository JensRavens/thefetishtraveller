# frozen_string_literal: true

class TitleholderPolicy < ApplicationPolicy
  def show?
    true
  end

  def update?
    user&.admin?
  end
end
