# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                   :uuid             not null, primary key
#  email                :string
#  first_name           :string
#  last_name            :string
#  password_digest      :string
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  roles                :string           default([]), not null, is an Array
#  facebook_id          :string
#  apple_id             :string
#  slug                 :string
#  location_description :string
#  bio                  :string
#  twitter              :string
#  instagram            :string
#  recon                :string
#  romeo                :string
#  bluf                 :string
#  visibility           :string
#  onlyfans             :string
#

class User < ApplicationRecord
  include SecureId
  extend FriendlyId
  friendly_id :first_name, use: :slugged
  has_secure_password validations: false
  acts_as_taggable_on :tags

  has_many :travel_plans, dependent: :destroy
  has_many :events, through: :travel_plans
  has_many :sessions, dependent: :destroy
  has_many :follows, dependent: :delete_all
  has_many :followed_users, dependent: false, through: :follows, source: :profile, class_name: "User"
  has_many :followings, dependent: :delete_all, class_name: "Follow", foreign_key: :profile_id
  has_many :posts, dependent: :destroy
  has_many :likes, dependent: :delete_all
  has_many :conversation_members, dependent: :destroy
  has_many :conversations, through: :conversation_members
  has_many :comments, dependent: :delete_all
  has_many :notifications, dependent: :delete_all
  has_many :titleholders, dependent: :nullify

  has_and_belongs_to_many :owned_events, class_name: "Event"
  has_and_belongs_to_many :owned_locations, class_name: "Location"

  has_one_attached :avatar
  has_one_attached :hero

  scope :guest, -> { where(email: nil) }
  scope :onboarded, -> { where.not(visibility: nil) }
  scope :onboarding, -> { where(visibility: nil) }
  scope :public_profile, -> { where(visibility: "public") }
  scope :internal_profile, -> { where(visibility: "internal") }

  validates :slug, :email, presence: true, uniqueness: { case_sensitive: false }, on: :profile_edit
  validates :slug, format: { with: /\A[a-zA-Z\d\-_]*\z/ }

  enum visibility: [:public, :internal].index_with(&:to_s), _prefix: :visibility

  before_save do
    self.tag_list = parsed_tags if bio_changed?
  end

  class << self
    def authenticate_facebook(token)
      response = HTTParty.get "https://graph.facebook.com/me", query: { fields: "id,first_name,last_name,email", access_token: token }
      raise "facebook request error: #{response.code}" unless response.code == 200

      data = OpenStruct.new JSON.parse(response.body).symbolize_keys
      user = User.find_or_initialize_by facebook_id: data.id
      user.assign_attributes email: data.email, first_name: data.first_name, last_name: data.last_name
      user.save!
      user
    end

    def authenticate_apple(id:, email:, first_name: nil, last_name: nil)
      user = User.find_by(apple_id: id) || User.find_by(email: email) || User.new(id: id)
      user.apple_id ||= id
      user.email ||= email
      user.first_name ||= first_name
      user.last_name ||= last_name
      user.save! if user.changed?
      user
    end

    def authenticate_email(email:)
      User.find_or_create_by(email: email)
    end
  end

  def migrate_to(user)
    likes.update_all user_id: user.id
  end

  def guest?
    email.blank? && facebook_id.blank?
  end

  def admin?
    roles.include? "admin"
  end

  def level
    return "admin" if admin?

    guest? ? "guest" : "user"
  end

  def name
    [first_name, last_name].presence.join(" ").presence
  end

  def public_name
    slug.presence || first_name
  end

  def avatar_image
    return avatar if avatar.attached?

    hash = Digest::MD5.hexdigest(email.to_s.downcase)
    "https://www.gravatar.com/avatar/#{hash}?d=mm&s=400"
  end

  def social_links
    @social_links ||= SocialLink::NETWORKS
      .map { |e| SocialLink.new(e, public_send(e)) if public_send(e).present? }
      .compact
  end

  def follows?(user)
    follows.where(profile: user).any?
  end

  def private_conversation(with:)
    member_id = [id, with.id].sort.join(":")
    Conversation.find_or_create_by!(member_lookup: member_id) do |conversation|
      conversation.conversation_members.build user: self
      conversation.conversation_members.build user: with
    end
  end

  def like!(post:)
    likes.create!(post: post)
    Notification.notifiy sender: self, user: post.user, subject: post, type: :liked
  end

  def unlike!(post:)
    likes.where(post: post).delete_all
  end

  def unread_notifications_count
    notifications.unread.size
  end

  def comment!(post:, text:)
    comments.create!(post: post, text: text)
    Notification.notifiy sender: self, user: post.user, subject: post, type: :commented
  end

  def follow!(user:)
    Follow.create!(profile: user, user: self)
    Notification.notifiy sender: self, user: user, type: :followed
  end

  def onboarded?
    visibility.present?
  end

  private

  def parsed_tags
    bio.to_s.scan(Post::HASHTAG_REGEX).flatten.map { |tag| tag.strip[1..] }
  end
end
