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

ActiveRecord::Schema.define(version: 2019_03_01_151856) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "annotation_labels", id: :serial, force: :cascade do |t|
    t.string "label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "annotations", id: :serial, force: :cascade do |t|
    t.string "nct_id"
    t.string "label"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "feeds", force: :cascade do |t|
    t.string "name", null: false
    t.string "kind", null: false
    t.string "user_id", null: false
    t.jsonb "search_params", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "reviews", id: :serial, force: :cascade do |t|
    t.string "nct_id"
    t.integer "overall_rating"
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["nct_id"], name: "reviews_nct_id"
    t.index ["user_id"], name: "reviews_user_id"
  end

  create_table "short_links", force: :cascade do |t|
    t.string "short", null: false
    t.string "long", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["long"], name: "index_short_links_on_long", unique: true
    t.index ["short"], name: "index_short_links_on_short", unique: true
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "nct_id"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
  end

  create_table "user_session_studies", id: :serial, force: :cascade do |t|
    t.string "nct_id"
    t.text "serialized_study"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.index ["nct_id"], name: "user_session_studies_nct_id"
    t.index ["user_id"], name: "user_session_studies_user_id"
  end

  create_table "users", id: :serial, force: :cascade do |t|
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "wiki_page_edits", id: :serial, force: :cascade do |t|
    t.integer "wiki_page_id"
    t.integer "user_id"
    t.text "diff"
    t.text "diff_html"
    t.text "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_wiki_page_edits_on_user_id"
    t.index ["wiki_page_id"], name: "index_wiki_page_edits_on_wiki_page_id"
  end

  create_table "wiki_pages", id: :serial, force: :cascade do |t|
    t.string "nct_id"
    t.text "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["nct_id"], name: "index_wiki_pages_on_nct_id", unique: true
  end

  add_foreign_key "wiki_page_edits", "users"
  add_foreign_key "wiki_page_edits", "wiki_pages"
end
