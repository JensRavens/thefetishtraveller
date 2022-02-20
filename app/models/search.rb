# frozen_string_literal: true

class Search
  attr_reader :term

  def initialize(term:)
    @term = term
  end

  def results
    @results ||= [users, titleholders, articles, events].flat_map { |e| e.limit(10) }
  end

  private

  def users
    User.searched(term).least_recently_active
  end

  def events
    Event.searched(term).published.reverse_chronologic
  end

  def titleholders
    Titleholder.searched(term).listed
  end

  def articles
    Article.searched(term).listed
  end
end
