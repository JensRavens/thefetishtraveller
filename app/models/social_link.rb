# frozen_string_literal: true

class SocialLink
  NETWORKS = [:twitter, :instagram, :recon, :romeo, :bluf, :onlyfans].freeze

  attr_accessor :network, :profile

  def initialize(network, profile)
    @network = network
    @profile = profile
  end

  def url
    case network
    when :twitter
      "https://twitter.com/#{profile}"
    when :instagram
      "https://instagram.com/#{profile}"
    when :recon
      "https://www.recon.com/#{profile}"
    when :romeo
      "https://www.romeo.com/profile/#{profile}"
    when :bluf
      "https://bluf.com/profiles/#{profile}"
    when :onlyfans
      "https://onlyfans.com/#{profile}"
    end
  end
end
