# frozen_string_literal: true

class PostPolicy < ApplicationPolicy
  def destroy?
    record.user == user
  end
end
