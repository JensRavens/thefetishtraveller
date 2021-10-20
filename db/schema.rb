# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_10_20_100459) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "active_admin_comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.uuid "resource_id"
    t.string "author_type"
    t.uuid "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.uuid "record_id", null: false
    t.string "record_type", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "action", null: false
    t.jsonb "modifications", null: false
    t.uuid "object_id", null: false
    t.string "object_type", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "comments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "post_id", null: false
    t.uuid "user_id", null: false
    t.string "text", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "conversation_members", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "conversation_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["conversation_id", "user_id"], name: "index_conversation_members_on_conversation_id_and_user_id", unique: true
    t.index ["conversation_id"], name: "index_conversation_members_on_conversation_id"
    t.index ["user_id"], name: "index_conversation_members_on_user_id"
  end

  create_table "conversations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "unread_count"
    t.string "member_lookup"
    t.datetime "last_message_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["member_lookup"], name: "index_conversations_on_member_lookup", unique: true
  end

  create_table "events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.jsonb "properties", default: "{}", null: false
    t.datetime "publish_at"
    t.datetime "publish_until"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.uuid "location_id"
    t.uuid "event_id"
    t.string "name", null: false
    t.datetime "start_at", null: false
    t.datetime "end_at", null: false
    t.string "website"
    t.boolean "official", default: false, null: false
    t.text "abstract"
    t.text "description"
    t.string "ticket_link"
    t.string "organizer_name"
    t.text "categories", default: [], null: false, array: true
    t.string "series"
    t.boolean "full_day", default: false, null: false
    t.string "bluf_id"
    t.index ["bluf_id"], name: "index_events_on_bluf_id", unique: true
    t.index ["event_id"], name: "index_events_on_event_id"
    t.index ["location_id"], name: "index_events_on_location_id"
    t.index ["slug"], name: "index_events_on_slug"
  end

  create_table "events_users", id: false, force: :cascade do |t|
    t.uuid "event_id", null: false
    t.uuid "user_id", null: false
  end

  create_table "follows", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "profile_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["profile_id"], name: "index_follows_on_profile_id"
    t.index ["user_id", "profile_id"], name: "index_follows_on_user_id_and_profile_id", unique: true
    t.index ["user_id"], name: "index_follows_on_user_id"
  end

  create_table "likes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "post_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["post_id"], name: "index_likes_on_post_id"
    t.index ["user_id", "post_id"], name: "index_likes_on_user_id_and_post_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "locations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.jsonb "properties", default: "{}", null: false
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", null: false
    t.string "country_code", null: false
    t.string "address"
    t.string "zip"
    t.string "city"
    t.decimal "lat"
    t.decimal "lon"
    t.string "category"
    t.string "timezone"
    t.string "bluf_id"
    t.index ["bluf_id"], name: "index_locations_on_bluf_id", unique: true
    t.index ["category"], name: "index_locations_on_category"
    t.index ["slug"], name: "index_locations_on_slug"
  end

  create_table "locations_users", id: false, force: :cascade do |t|
    t.uuid "location_id", null: false
    t.uuid "user_id", null: false
  end

  create_table "messages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "text"
    t.datetime "read_at"
    t.string "type"
    t.uuid "conversation_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "notifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "sender_id", null: false
    t.datetime "read_at"
    t.string "notification_type"
    t.string "subject_type"
    t.uuid "subject_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["sender_id"], name: "index_notifications_on_sender_id"
    t.index ["subject_type", "subject_id"], name: "index_notifications_on_subject"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "posts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "location_description"
    t.string "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "sessions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.text "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "taggings", id: :serial, force: :cascade do |t|
    t.integer "tag_id"
    t.string "taggable_type"
    t.uuid "taggable_id"
    t.string "tagger_type"
    t.uuid "tagger_id"
    t.string "context", limit: 128
    t.datetime "created_at"
    t.string "tenant", limit: 128
    t.index ["context"], name: "index_taggings_on_context"
    t.index ["tag_id", "taggable_id", "taggable_type", "context", "tagger_id", "tagger_type"], name: "taggings_idx", unique: true
    t.index ["tag_id"], name: "index_taggings_on_tag_id"
    t.index ["taggable_id", "taggable_type", "context"], name: "taggings_taggable_context_idx"
    t.index ["taggable_id", "taggable_type", "tagger_id", "context"], name: "taggings_idy"
    t.index ["taggable_id"], name: "index_taggings_on_taggable_id"
    t.index ["taggable_type"], name: "index_taggings_on_taggable_type"
    t.index ["tagger_id", "tagger_type"], name: "index_taggings_on_tagger_id_and_tagger_type"
    t.index ["tagger_id"], name: "index_taggings_on_tagger_id"
    t.index ["tenant"], name: "index_taggings_on_tenant"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer "taggings_count", default: 0
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "travel_plans", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "event_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_travel_plans_on_event_id"
    t.index ["user_id"], name: "index_travel_plans_on_user_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "roles", default: [], null: false, array: true
    t.string "facebook_id"
    t.string "apple_id"
    t.string "slug"
    t.string "location_description"
    t.string "bio"
    t.string "twitter"
    t.string "instagram"
    t.string "recon"
    t.string "romeo"
    t.string "bluf"
    t.string "visibility"
    t.string "onlyfans"
    t.index ["apple_id"], name: "index_users_on_apple_id", unique: true
    t.index ["email"], name: "index_users_on_email"
    t.index ["facebook_id"], name: "index_users_on_facebook_id"
    t.index ["slug"], name: "index_users_on_slug", unique: true
    t.index ["visibility"], name: "index_users_on_visibility"
  end

  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "activities", "users"
  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "conversation_members", "conversations"
  add_foreign_key "conversation_members", "users"
  add_foreign_key "events", "events"
  add_foreign_key "events", "locations"
  add_foreign_key "follows", "users"
  add_foreign_key "follows", "users", column: "profile_id"
  add_foreign_key "likes", "posts"
  add_foreign_key "likes", "users"
  add_foreign_key "messages", "conversations"
  add_foreign_key "messages", "users"
  add_foreign_key "notifications", "users"
  add_foreign_key "notifications", "users", column: "sender_id"
  add_foreign_key "posts", "users"
  add_foreign_key "sessions", "users"
  add_foreign_key "taggings", "tags"
  add_foreign_key "travel_plans", "events"
  add_foreign_key "travel_plans", "users"
end
