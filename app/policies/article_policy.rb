# frozen_string_literal: true

class ArticlePolicy < ApplicationPolicy
  def show?
    true
  end

  def update?
    admin? || record.user_id == user&.id
  end
end
