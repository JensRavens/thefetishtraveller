# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :toggleLike, mutation: Mutations::ToggleLike
  end
end
