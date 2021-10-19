# frozen_string_literal: true

class PostPolicy < ApplicationPolicy
  def destroy?
    record.user == user
  end

  def report?
    record.user != user
  end

  def comment?
    user
  end
end
