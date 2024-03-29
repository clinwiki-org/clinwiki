# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_03_30_155744) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "annotation_labels", force: :cascade do |t|
    t.string "label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "annotations", force: :cascade do |t|
    t.string "nct_id"
    t.string "label"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "crowd_key_value_ids", comment: "the storage of the crowd key value for other keys in db - main use study id", force: :cascade do |t|
    t.text "crowd_key", null: false
    t.text "crowd_value", null: false
    t.text "crowd_key_value_id_association", null: false
    t.bigint "user_id", null: false
    t.boolean "verified", null: false
    t.boolean "approved", null: false
    t.text "evidence"
    t.boolean "indexed", default: true, null: false
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
  end

  create_table "crowd_keys", comment: "crowd_key list storage table with additional configuration info", force: :cascade do |t|
    t.text "crowd_key", null: false
    t.text "crowd_key_type", default: "facet", null: false
    t.text "crowd_key_data_type", default: "short_text", null: false
    t.text "crowd_key_primarykey", default: "nct_id", null: false
    t.text "default_facet_type", default: "multi_checkbox", null: false
    t.boolean "indexed", default: true, null: false
    t.text "indexed_type", default: "facet_multiple", null: false
    t.text "crowd_key_description"
    t.text "crowd_key_helper_text"
    t.text "crow_key_status", default: "Active", null: false
    t.text "crowd_key_default_icon"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
  end

  create_table "crowd_values", comment: "crowd value storage table", force: :cascade do |t|
    t.bigint "crowd_key_id", null: false
    t.text "crowd_value", null: false
    t.text "crowd_value_description"
    t.text "crowd_value_helper_text"
    t.text "crowd_value_status", default: "Active", null: false
    t.text "crowd_value_default_icon"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
  end

  create_table "facility_locations", force: :cascade do |t|
    t.string "name"
    t.string "city"
    t.string "state"
    t.string "zip"
    t.string "country"
    t.float "latitude"
    t.float "longitude"
    t.string "status"
    t.index ["name", "city", "state", "zip", "country"], name: "facility_locations_idx", unique: true
  end

  create_table "island_configs", force: :cascade do |t|
    t.string "config"
    t.string "island_type"
  end

  create_table "locations", force: :cascade do |t|
    t.string "name"
    t.float "latitude"
    t.float "longitude"
    t.datetime "checked"
    t.string "last_error"
    t.string "location_type"
    t.string "partial_match"
    t.index ["name"], name: "index_locations_on_name", unique: true
  end

  create_table "page_views", force: :cascade do |t|
    t.bigint "site_id"
    t.string "title"
    t.text "template"
    t.jsonb "updates", default: [], null: false
    t.integer "page_type", default: 0
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "default", default: false, null: false
    t.index ["site_id"], name: "index_page_views_on_site_id"
  end

  create_table "pipeline_queue", id: :serial, force: :cascade do |t|
    t.datetime "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.text "job_type"
    t.text "payload"
  end

  create_table "reaction_kinds", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "unicode"
  end

  create_table "reactions", force: :cascade do |t|
    t.string "nct_id", null: false
    t.bigint "user_id", null: false
    t.bigint "reaction_kind_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["reaction_kind_id"], name: "index_reactions_on_reaction_kind_id"
    t.index ["user_id", "nct_id", "reaction_kind_id"], name: "index_reactions_on_user_id_and_nct_id_and_reaction_kind_id"
    t.index ["user_id"], name: "index_reactions_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.string "nct_id"
    t.integer "overall_rating"
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["nct_id"], name: "reviews_nct_id"
    t.index ["user_id"], name: "reviews_user_id"
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "saved_searches", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "short_link_id"
    t.string "name_label"
    t.boolean "is_subscribed", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "url"
    t.string "search_hash", limit: 255
    t.index ["short_link_id"], name: "index_saved_searches_on_short_link_id"
    t.index ["user_id"], name: "index_saved_searches_on_user_id"
  end

  create_table "search_exports", force: :cascade do |t|
    t.integer "short_link_id", null: false
    t.integer "user_id"
    t.integer "site_view_id"
    t.string "s3_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "search_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "short_link_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name_default"
    t.index ["short_link_id"], name: "index_search_logs_on_short_link_id"
    t.index ["user_id"], name: "index_search_logs_on_user_id"
  end

  create_table "short_links", force: :cascade do |t|
    t.string "short", null: false
    t.string "long", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["long"], name: "index_short_links_on_long", unique: true
    t.index ["short"], name: "index_short_links_on_short", unique: true
  end

  create_table "site_views", force: :cascade do |t|
    t.jsonb "updates", default: [], null: false
    t.bigint "site_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.boolean "default", default: false, null: false
    t.string "description", default: ""
    t.string "url", default: ""
    t.index ["site_id"], name: "index_site_views_on_site_id"
  end

  create_table "sites", force: :cascade do |t|
    t.string "name"
    t.string "subdomain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "skip_landing"
    t.text "themes", default: "{\"primaryColor\":\"#6BA5D6\",\"secondaryColor\":\"#1b2a38\",\"lightTextColor\":\"#eee\",\"secondaryTextColor\":\"#333\",\"backgroundColor\":\"#4D5863\",\"primaryAltColor\":\"#5786AD\",\"authHeaderColor\":\"#5786AD\",\"sideBarColor\":\"#4d5762\"} "
    t.text "user_rank", default: "[{\"rank\":\"default\",\"gte\":0},{\"rank\":\"bronze\",\"gte\":26},{\"rank\":\"silver\",\"gte\":51},{\"rank\":\"gold\",\"gte\":75},{\"rank\":\"platinum\",\"gte\":101}] "
    t.text "reactions_config", default: "[]"
    t.boolean "hide_donation"
    t.text "default_hash", default: "gELcp_Fb", null: false
    t.text "default_search_page", default: "search"
    t.index ["subdomain"], name: "index_sites_on_subdomain", unique: true
  end

  create_table "study_view_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.string "nct_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_study_view_logs_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "nct_id"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "user_session_studies", force: :cascade do |t|
    t.string "nct_id"
    t.text "serialized_study"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["nct_id"], name: "user_session_studies_nct_id"
    t.index ["user_id"], name: "user_session_studies_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "first_name"
    t.string "last_name"
    t.string "default_query_string"
    t.json "search_result_columns"
    t.string "picture_url"
    t.string "reset_token_url"
    t.string "search_notification_criteria"
    t.datetime "search_last_notification", default: "2021-05-27 14:03:33"
    t.integer "search_notification_frequency"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "wiki_page_edits", force: :cascade do |t|
    t.bigint "wiki_page_id"
    t.bigint "user_id"
    t.text "diff"
    t.text "diff_html"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_wiki_page_edits_on_user_id"
    t.index ["wiki_page_id"], name: "index_wiki_page_edits_on_wiki_page_id"
  end

  create_table "wiki_pages", force: :cascade do |t|
    t.string "nct_id"
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nct_id"], name: "index_wiki_pages_on_nct_id", unique: true
  end

  create_table "workflows_views", force: :cascade do |t|
    t.jsonb "updates", default: [], null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "crowd_key_value_ids", "users", name: "crowd_key_value_ids_user_id_fkey", on_update: :restrict, on_delete: :restrict
  add_foreign_key "crowd_values", "crowd_keys", name: "crowd_values_crowd_key_id_fkey", on_update: :restrict, on_delete: :restrict
  add_foreign_key "page_views", "sites"
  add_foreign_key "reactions", "users"
  add_foreign_key "site_views", "sites"
  add_foreign_key "wiki_page_edits", "users"
  add_foreign_key "wiki_page_edits", "wiki_pages"
end
