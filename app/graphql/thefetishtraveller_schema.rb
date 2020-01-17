# frozen_string_literal: true

class ThefetishtravellerSchema < GraphQL::Schema
  mutation(Types::MutationType)
  query(Types::QueryType)
  use GraphQL::Batch
end
