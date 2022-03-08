# frozen_string_literal: true

class PostPolicy < ApplicationPolicy
  def destroy?
    record.user == user
  end

  def update?
    record.user == user
  end

  def report?
    record.user != user
  end

  def like?
    user&.onboarded?
  end

  def comment?
    user&.onboarded?
  end
end
