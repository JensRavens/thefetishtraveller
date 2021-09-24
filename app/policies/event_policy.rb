# frozen_string_literal: true

class EventPolicy < ApplicationPolicy
  def travel?
    record.published?
  end

  def update?
    user&.admin?
  end
end
