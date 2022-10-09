# frozen_string_literal: true

class EventPolicy < ApplicationPolicy
  def travel?
    record.published?
  end

  def update?
    admin? || owner?
  end

  def add_subevent?
    admin? || owner?
  end

  private

  def owner?
    user && record.owner_ids.include?(user.id)
  end
end
